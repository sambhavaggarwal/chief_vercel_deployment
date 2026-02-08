from openai import OpenAI

client = OpenAI(
    api_key="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"
)

response = client.responses.create(
    model="gpt-5.2", input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
