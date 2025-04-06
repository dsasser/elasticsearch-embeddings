"""Synthetic data generator for embedding demonstrations."""

import random
from typing import Dict, List, Optional
import numpy as np

class SyntheticDataGenerator:
    """Generates synthetic documents with semantic relationships."""
    
    def __init__(self, seed: Optional[int] = None):
        """Initialize the generator with optional random seed."""
        if seed is not None:
            random.seed(seed)
            np.random.seed(seed)
        
        self.topics = {
            "AI": {
                "subtopics": [
                    "machine learning",
                    "deep learning",
                    "neural networks",
                    "reinforcement learning",
                    "supervised learning",
                    "unsupervised learning"
                ],
                "applications": [
                    "predictive analytics",
                    "pattern recognition",
                    "automated decision making",
                    "anomaly detection",
                    "recommendation systems",
                    "forecasting"
                ],
                "concepts": [
                    "feature engineering",
                    "model training",
                    "hyperparameter tuning",
                    "cross-validation",
                    "overfitting",
                    "underfitting"
                ]
            },
            "NLP": {
                "subtopics": [
                    "natural language processing",
                    "text analysis",
                    "sentiment analysis",
                    "named entity recognition",
                    "text classification",
                    "language modeling"
                ],
                "applications": [
                    "chatbots",
                    "translation",
                    "text summarization",
                    "question answering",
                    "information extraction",
                    "document classification"
                ],
                "concepts": [
                    "word embeddings",
                    "attention mechanisms",
                    "tokenization",
                    "part-of-speech tagging",
                    "dependency parsing",
                    "semantic analysis"
                ]
            },
            "Computer Vision": {
                "subtopics": [
                    "image processing",
                    "object detection",
                    "facial recognition",
                    "image segmentation",
                    "optical character recognition",
                    "video analysis"
                ],
                "applications": [
                    "autonomous vehicles",
                    "medical imaging",
                    "surveillance",
                    "augmented reality",
                    "quality control",
                    "remote sensing"
                ],
                "concepts": [
                    "convolutional networks",
                    "feature extraction",
                    "image augmentation",
                    "transfer learning",
                    "object tracking",
                    "depth estimation"
                ]
            }
        }
        
        self.content_types = {
            "definition": self._generate_definition,
            "application": self._generate_application,
            "comparison": self._generate_comparison,
            "tutorial": self._generate_tutorial,
            "case_study": self._generate_case_study
        }
    
    def _generate_definition(self, category: str, topic_info: Dict) -> str:
        """Generate a definition-style content."""
        subtopic = random.choice(topic_info["subtopics"])
        concept = random.choice(topic_info["concepts"])
        return f"{subtopic.title()} is a {category} technique that focuses on {concept}. " \
               f"It enables computers to {random.choice(topic_info['applications'])}."
    
    def _generate_application(self, category: str, topic_info: Dict) -> str:
        """Generate an application-focused content."""
        subtopic = random.choice(topic_info["subtopics"])
        application = random.choice(topic_info["applications"])
        concept = random.choice(topic_info["concepts"])
        return f"In {category}, {subtopic} is commonly used for {application}. " \
               f"This involves {concept} to achieve optimal results."
    
    def _generate_comparison(self, category: str, topic_info: Dict) -> str:
        """Generate a comparison between different topics."""
        other_category = random.choice([c for c in self.topics.keys() if c != category])
        other_topic = self.topics[other_category]
        
        subtopic1 = random.choice(topic_info["subtopics"])
        subtopic2 = random.choice(other_topic["subtopics"])
        
        return f"While {category} focuses on {subtopic1}, {other_category} emphasizes {subtopic2}. " \
               f"Both approaches contribute to {random.choice(topic_info['applications'])}."
    
    def _generate_tutorial(self, category: str, topic_info: Dict) -> str:
        """Generate a tutorial-style content."""
        subtopic = random.choice(topic_info["subtopics"])
        concept = random.choice(topic_info["concepts"])
        steps = random.sample(topic_info["concepts"], min(3, len(topic_info["concepts"])))
        
        tutorial = f"This tutorial covers {subtopic} in {category}. "
        tutorial += "The process involves: " + ", ".join(steps) + ". "
        tutorial += f"Key concepts include {concept}."
        
        return tutorial
    
    def _generate_case_study(self, category: str, topic_info: Dict) -> str:
        """Generate a case study content."""
        subtopic = random.choice(topic_info["subtopics"])
        application = random.choice(topic_info["applications"])
        concept = random.choice(topic_info["concepts"])
        
        return f"A case study in {category} demonstrates how {subtopic} was applied to {application}. " \
               f"The solution leveraged {concept} to achieve significant improvements."
    
    def generate_document(self, doc_id: int) -> Dict:
        """Generate a single synthetic document."""
        category = random.choice(list(self.topics.keys()))
        topic_info = self.topics[category]
        
        # Choose content type with weighted probabilities
        content_type = random.choices(
            list(self.content_types.keys()),
            weights=[0.3, 0.3, 0.2, 0.1, 0.1]
        )[0]
        
        # Generate content based on type
        content = self.content_types[content_type](category, topic_info)
        
        # Generate tags
        tags = (
            random.sample(topic_info["subtopics"], min(2, len(topic_info["subtopics"]))) +
            random.sample(topic_info["concepts"], min(2, len(topic_info["concepts"]))) +
            [category]
        )
        
        return {
            "id": f"doc{doc_id}",
            "title": f"{random.choice(topic_info['subtopics']).title()} in {category}",
            "content": content,
            "category": category,
            "tags": list(set(tags)),  # Remove duplicates
            "type": content_type,
            "difficulty": random.choice(["beginner", "intermediate", "advanced"]),
            "length": random.choice(["short", "medium", "long"])
        }
    
    def generate_dataset(self, num_documents: int = 100) -> List[Dict]:
        """Generate a dataset of synthetic documents."""
        return [self.generate_document(i + 1) for i in range(num_documents)] 