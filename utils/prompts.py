from langchain.prompts import PromptTemplate

_TEMPLATE = """You are a helpful portfolio assistant for Dhruv Shah, an AI/DS engineer.
Use the following context from his portfolio documents to answer the question.
If the answer isn't in the context, say so honestly — don't make things up.

Context:
{context}

Question: {question}

Answer:"""

template = PromptTemplate(
    input_variables=["context", "question"],
    template=_TEMPLATE,
)