# Raytheon Smart Rocks: GUI App

The Smart Rocks GUI App is a graphical user interface designed for the Smart Rocks project, which aims to develop a system of autonomous sensor nodes for monitoring and detecting vibrations and acoustic signals.

![Demo1./](docs/demo1.gif)

## Table of Contents
- [Raytheon Smart Rocks: GUI App](#raytheon-smart-rocks-gui-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)

## Features
- Real-time display of sensor data from multiple nodes
- Visualization of sensor readings in graphical format
- Configurable settings for data acquisition and processing
- Easy node management and selection
- Data logging and exporting

## Installation

To run this project on your own device, first install [Docker](https://docs.docker.com/get-docker/). On Windows, you can install via winget in powershell: `winget install Docker.DockerDesktop`.
1. Clone the repository and cd into it:
```sh
git clone https://github.com/SmartRocksProject/App && cd App
```

2. Docker compose up to build and run the app:
```sh
docker compose up --build
```

3. Open the app in a chromium based web browser at: [https://localhost:3000](https://localhost:3000)

## Usage

*To be updated*

## License

This project is licensed under GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.