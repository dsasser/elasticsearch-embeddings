from setuptools import setup, find_packages

setup(
    name="synthetic_data",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "python-dotenv==1.0.0",
        "requests==2.31.0",
        "elasticsearch==8.11.0",
        "numpy==1.24.3",
    ],
) 