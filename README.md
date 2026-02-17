# Audit Auto

An automated audit processing system built with Python, FastAPI, and AI-powered document analysis.

## Overview

Audit Auto is a comprehensive solution for automating audit document processing. It leverages advanced AI models and document analysis tools to extract, process, and analyze audit data from various file formats including PDFs and Excel spreadsheets.

## Features

- 🚀 **Fast API Server** - Built with FastAPI for high-performance REST API endpoints
- 📄 **Multi-Format Support** - Process PDFs, Excel files (.xlsx), and other document formats
- 🤖 **AI-Powered Analysis** - Integrated with Google GenAI and LangChain for intelligent document processing
- 🔍 **Vector Search** - Uses ChromaDB and Sentence Transformers for semantic search and analysis
- 📊 **Data Processing** - Pandas integration for advanced data manipulation and analysis
- 🔐 **Environment Configuration** - Secure configuration management with python-dotenv

## Tech Stack

- **Backend Framework**: FastAPI, Uvicorn
- **Document Processing**: PyPDF, openpyxl
- **AI/ML**: LangChain, LangChain-Community, LangChain-Google-GenAI
- **Vector Database**: ChromaDB
- **Data Processing**: Pandas, Sentence-Transformers
- **Configuration**: python-dotenv

## Prerequisites

- Python 3.8 or higher
- pip package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sudarsan-sys/audit-auto.git
   cd audit-auto
