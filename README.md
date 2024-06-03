# Temp-Secret

This project is a simple application for managing temporary secrets.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Temp-Secret is designed to provide a secure and convenient way to store and manage temporary secrets. It allows users to securely store sensitive information, such as API keys, passwords, or access tokens, for a limited period of time. Once a secret is retrieved, it is destroyed and cannot be accessed again. This ensures that the secrets remain secure and cannot be compromised even if the storage is compromised.

## Features

- Store secrets securely
- Retrieve secrets as needed
- Gets destroyed after visiting once.
- Simple and intuitive user interface

## Installation

To install and run Temp-Secret locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ShubhamKadam098/Temp-Secret
   ```

2. Navigate to the project directory:

   ```bash
   cd temp-secret
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to access Temp-Secret.

## Usage

Once you have the application up and running, you can start using Temp-Secret to store your temporary secrets. Here's a brief overview of the main functionalities:

1. Create a new secret:

   - Click on the "New Secret" button.
   - Enter the secret information and secure it with password.
   - Click "Save" to store the secret.

2. Retrieve a secret:
   - Enter the secret link in the search bar.
   - Click "Reveal" to retrieve the secret.
   - Enter the password and secret will be displayed on the screen.
   - After retrieving nobody can access it again.

## Contributing

Contributions are welcome! If you would like to contribute to Temp-Secret, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.
