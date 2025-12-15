# FAQ Knowledge Base

## What is this application?

This application is an AI-powered FAQ system that answers user questions by retrieving relevant information and generating accurate responses using a language model.

## How does the FAQ bot work?

The bot uses embeddings to convert FAQ questions into vectors, performs similarity search to find relevant FAQs, and then generates a response using an AI model.

## What is Retrieval-Augmented Generation (RAG)?

RAG is an AI technique that retrieves relevant information from a knowledge base before generating an answer, improving accuracy and reducing hallucinations.

## Which AI model is used in this project?

The project uses a large language model provided via an external AI API to generate responses based on retrieved FAQ content.

## How are FAQs stored in the system?

FAQs are stored in a Markdown file and parsed into question–answer pairs, which are then converted into embeddings for efficient retrieval.

## Can I add or update FAQs easily?

Yes, new FAQs can be added by editing the Markdown file and regenerating embeddings so the system can index the updated content.

## Why are embeddings used in this project?

Embeddings allow the system to measure semantic similarity between user questions and stored FAQs, enabling accurate information retrieval.

## Does the bot support real-time responses?

Yes, the bot provides near real-time responses by combining fast vector search with an AI model for text generation.

## How does this system reduce incorrect answers?

By using RAG, the model generates answers strictly from retrieved FAQ content instead of relying only on its training data.

## Can this project be extended further?

Yes, the system can be extended with a web interface, database-backed FAQ storage, user authentication, and support for multiple documents.
