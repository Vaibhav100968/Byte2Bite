import openai
import pandas as pd
import os
from dotenv import load_dotenv
import os


# Load env variables from .env in the api folder
api_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(api_env_path)  # Load env variables from api/.env


# Initialize OpenAI client with error handling
try:
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"🔍 Debug: OPENAI_API_KEY found: {bool(api_key)}")
    if api_key:
        print(f"🔍 Debug: API key starts with: {api_key[:10]}...")
        # For latest OpenAI versions (1.0+), use OpenAI() constructor
        client = openai.OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized successfully")
    else:
        client = None
        print("⚠️ Warning: OPENAI_API_KEY not found in environment variables")
        print("🔍 Debug: Available env vars:", [
              k for k in os.environ.keys() if 'OPENAI' in k.upper()])
except Exception as e:
    client = None
    print(f"⚠️ Warning: Could not initialize OpenAI client: {e}")
    print(f"🔍 Debug: Exception type: {type(e)}")


business_profile = {}


def get_valid_input(prompt, check_func=None):
    while True:
        answer = input(prompt).strip()
        if not answer:
            print("⚠️ Please enter a response.")
            continue
        if check_func and not check_func(answer):
            print("⚠️ That doesn't look valid. Try again.")
            continue
        return clarify_with_gpt(prompt, answer)


def is_reasonable_hours(text):
    return any(char.isdigit() for char in text) or "am" in text.lower() or "pm" in text.lower()


def clarify_with_gpt(prompt_text, user_response):
    if not client:
        return user_response  # Return original response if client not available

    try:
        correction_prompt = f"""
You are a helpful assistant. The user was asked: "{prompt_text}" and they responded: "{user_response}".
If the response is unclear, misspelled, or vague, provide a cleaned-up or clarified version.
Otherwise, return it as-is. Respond with the corrected text only.
"""
        # Use newer OpenAI API syntax
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": correction_prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ Warning: Could not clarify with GPT: {e}")
        return user_response  # Return original response on error


def initialize_user():
    print("👋 Let's set up your business profile.")
    business_profile['name'] = get_valid_input("Business name: ")
    business_profile['location'] = get_valid_input(
        "Where are you located (city)? ")
    business_profile['type'] = get_valid_input(
        "What kind of food do you sell? (e.g. bakery, meals, drinks): ")
    business_profile['hours'] = get_valid_input(
        "What are your operating hours? (e.g. 8 AM - 8 PM): ", is_reasonable_hours)
    business_profile['goals'] = get_valid_input(
        "What's your biggest pain point right now (e.g. waste, low sales)? ")


def analyze_csv(file_path):
    if not os.path.exists(file_path):
        print("❌ CSV file not found. Make sure the file is in the folder.")
        return {}

    df = pd.read_csv(file_path)

    expected_columns = {'item', 'sold', 'wasted', 'price', 'cost'}
    if not expected_columns.issubset(set(df.columns)):
        print(f"❌ Your CSV must have these columns: {expected_columns}")
        return {}

    df['net_gain'] = (df['price'] - df['cost']) * df['sold']
    df['waste_loss'] = df['cost'] * df['wasted']

    summary = {
        'net_gain_total': round(df['net_gain'].sum(), 2),
        'waste_loss_total': round(df['waste_loss'].sum(), 2),
        'top_seller': df.loc[df['sold'].idxmax()]['item'],
        'low_seller': df.loc[df['sold'].idxmin()]['item'],
        'optimize_more': df[df['net_gain'] > df['waste_loss']]['item'].tolist(),
        'cut_back': df[df['waste_loss'] > df['net_gain']]['item'].tolist(),
    }

    return summary


def chat_with_gpt(user_msg, context_summary, business_profile=None):
    print(f"🔍 Debug: chat_with_gpt called with client: {client is not None}")
    if not client:
        print("🔍 Debug: Using fallback response (no OpenAI client)")
        # Fallback responses when OpenAI is not available
        return get_fallback_response(user_msg, context_summary, business_profile)

    print("🔍 Debug: Using OpenAI API")
    try:
        # Use provided business profile or default values
        profile = business_profile or {}
        business_name = profile.get('name', 'your business')
        business_location = profile.get('location', 'your location')
        business_type = profile.get('type', 'food business')
        business_hours = profile.get('hours', 'your operating hours')
        business_goals = profile.get('goals', 'your business goals')

        messages = [
            {"role": "system", "content": f"""
You are Byte2Bite, an expert AI assistant helping small food businesses succeed.


Business Info:
Name: {business_name}
Location: {business_location}
Food Type: {business_type}
Hours: {business_hours}
Pain Point: {business_goals}


Sales Summary:
- Net Gain: ${context_summary.get('net_gain_total', 0)}
- Waste Loss: ${context_summary.get('waste_loss_total', 0)}
- Top Seller: {context_summary.get('top_seller', 'N/A')}
- Least Seller: {context_summary.get('low_seller', 'N/A')}
- Consider stocking more: {context_summary.get('optimize_more', [])}
- Consider cutting back: {context_summary.get('cut_back', [])}


Your goals:
- Maximize income
- Reduce waste
- Adjust based on local conditions (e.g., rain, heat)
- Stay ahead of competitors


Speak clearly, suggest actionable strategies, and allow follow-up questions.
"""},
            {"role": "user", "content": user_msg},
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Sorry, there was an error connecting to the AI assistant: {str(e)}"


def get_fallback_response(user_msg, context_summary, business_profile=None):
    """Provide helpful responses even without OpenAI"""
    user_msg_lower = user_msg.lower()

    # Use provided business profile or default values
    profile = business_profile or {}
    business_name = profile.get('name', 'your business')
    business_type = profile.get('type', 'food business')

    # Inventory analysis responses
    if any(word in user_msg_lower for word in ['waste', 'reduce', 'optimize']):
        if context_summary and context_summary.get('waste_loss_total', 0) > 0:
            return f"Based on your data, {business_name} is losing ${context_summary['waste_loss_total']} to waste. Here are some strategies:\n\n• Implement FIFO (First In, First Out) inventory rotation\n• Set up daily waste tracking\n• Adjust portion sizes based on demand\n• Consider smaller batch preparation\n• Train staff on proper storage techniques"
        else:
            return f"To reduce waste in your {business_type}:\n\n• Track daily waste patterns\n• Implement portion control\n• Use FIFO inventory rotation\n• Adjust prep quantities based on demand\n• Consider donating excess food\n• Train staff on proper storage"

    elif any(word in user_msg_lower for word in ['reorder', 'stock', 'inventory']):
        if context_summary and context_summary.get('top_seller'):
            return f"Your top seller is {context_summary['top_seller']}. Consider:\n\n• Stocking more of high-demand items\n• Setting up automatic reorder points\n• Monitoring seasonal trends\n• Building relationships with reliable suppliers\n• Keeping safety stock for popular items"
        else:
            return f"For {business_name} inventory management:\n\n• Set minimum stock levels for each item\n• Monitor sales trends weekly\n• Build relationships with suppliers\n• Consider bulk ordering for discounts\n• Track seasonal demand patterns"

    elif any(word in user_msg_lower for word in ['profit', 'revenue', 'earnings']):
        if context_summary and context_summary.get('net_gain_total', 0) > 0:
            return f"Your current net gain is ${context_summary['net_gain_total']}. To increase profits:\n\n• Focus on your top performers: {context_summary.get('optimize_more', [])}\n• Review pricing strategy\n• Reduce waste (currently ${context_summary.get('waste_loss_total', 0)})\n• Consider upselling opportunities\n• Optimize portion sizes"
        else:
            return f"To increase profits for {business_name}:\n\n• Analyze your best-selling items\n• Review pricing strategy\n• Reduce waste and spoilage\n• Consider upselling opportunities\n• Optimize portion sizes\n• Track food costs regularly"

    elif any(word in user_msg_lower for word in ['trend', 'analysis', 'data']):
        if context_summary:
            return f"Based on {business_name}'s inventory data:\n\n• Top Seller: {context_summary.get('top_seller', 'N/A')}\n• Low Performer: {context_summary.get('low_seller', 'N/A')}\n• Net Gain: ${context_summary.get('net_gain_total', 0)}\n• Waste Loss: ${context_summary.get('waste_loss_total', 0)}\n\nConsider focusing on {context_summary.get('optimize_more', [])} and reviewing {context_summary.get('cut_back', [])}"
        else:
            return f"To analyze {business_name}'s business trends:\n\n• Track daily sales patterns\n• Monitor seasonal demand\n• Analyze customer preferences\n• Review waste patterns\n• Compare week-over-week performance\n• Identify peak hours and days"

    elif any(word in user_msg_lower for word in ['help', 'advice', 'suggest']):
        return f"I can help {business_name} with:\n\n• Inventory optimization strategies\n• Waste reduction techniques\n• Profit maximization\n• Sales trend analysis\n• Reorder recommendations\n• Cost analysis\n\nWhat specific area would you like to focus on?"

    else:
        return f"I'm here to help optimize {business_name}! I can assist with:\n\n• Inventory management\n• Waste reduction\n• Profit optimization\n• Sales analysis\n• Cost control\n\nTry asking about specific areas like 'How can I reduce waste?' or 'What should I reorder?'"


if __name__ == "__main__":
    print("Welcome to Byte2Bite Chatbot 🍽️")

    initialize_user()

    csv_path = input("\n📄 Upload your sales CSV (e.g. 'inventory.csv'): ")
    summary = analyze_csv(csv_path)

    if not summary:
        print("❌ Could not proceed without valid data.")
        exit()

    print("\n✅ Setup complete! Start chatting with your AI assistant.\n(Type 'quit' to exit)")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye", "forget"]:
            print("👋 Goodbye! Hope your profits soar 🚀")
            break

        response = chat_with_gpt(user_input, summary)
        print(f"\nByte2Bite: {response}\n")
        if "optimize more" in response.lower() or "cut back" in response.lower():
            print("🔍 Would you like to see more details on your sales data? (yes/no)")
            if input().strip().lower() == 'yes':
                print("\nHere are the details from your CSV:")
                print(pd.read_csv(csv_path).to_string(index=False))
