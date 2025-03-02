---
sidebar_position: 2
---

# Project Setup Guide

This guide will help you set up and run the Crypto Price Tracker project.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn

## Web App Setup (Next.js)

Follow these steps to set up and run the web application:

1. Clone the repository:
   ```bash
   git clone https://github.com/mannadamay12/crypto-price-tracker.git
   cd crypto-price-tracker
   ```

2. Install dependencies:
    ```bash
    cd web-app
    npm install
    # or
    yarn install
    ```

3. Run the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```
4. Open your browser and navigate to http://localhost:3000 to see the application.

## Documentation Setup (Docusaurus)
To run the documentation site locally:

1. Navigate to the docs directory:
    ```bash
    cd ../docs
    ```
2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3. Start the documentation server:
    ```bash
    npm run start
    # or
    yarn start
    ```
4. Open your browser and navigate to http://localhost:3000 to view the documentation. 
(`you might need to choose another port if the web-app is live on PORT 3000`)

## Building for Production

### Web App

```bash
cd web-app
npm run build
# or
yarn build
```

### Documentation

```bash
cd docs
npm run build
# or
yarn build
```