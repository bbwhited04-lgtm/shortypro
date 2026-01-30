import os

MODELS = [
    {"id": "gpt-4o-mini", "label": "OpenAI • 4o mini", "provider": "openai"},
    # Add only models you actually have access to:
    # {"id": "o1-mini", "label": "OpenAI • o1 mini", "provider": "openai"},
    # {"id": "o1", "label": "OpenAI • o1", "provider": "openai"},
    {"id": "deepseek-chat", "label": "DeepSeek • Chat", "provider": "deepseek"},
]

def default_model():
    return os.getenv("DEFAULT_MODEL", "gpt-4o-mini")
