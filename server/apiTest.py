import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

if not HF_API_KEY:
    raise ValueError("Set HF_API_KEY in your .env file")

# Create the client (Serverless free API)
client = InferenceClient(token=HF_API_KEY)

prompt = "List 3 drought-resistant trees suitable for Nairobi, Kenya in JSON format."

# Use chat completion endpoint
completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3-0324",  # Free serverless model
    messages=[{"role": "user", "content": prompt}]
)

# Print result
print(completion.choices[0].message.content)
