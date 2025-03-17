import ollama

response = ollama.embeddings(model="mxbai-embed-large", prompt="Hello, how are you?")
print(response)