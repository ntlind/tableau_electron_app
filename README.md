# Graphik: A Tableau-esque Electron App

https://user-images.githubusercontent.com/58986949/115314310-805b2780-a1a7-11eb-8558-648a367ea231.mp4

## Description
- Electron
This app. emulates many of my favorite Tableau features using Electron and Next.js. Tableau is a fantastic tool for building data visualizations, but it's become bloated, slow, and expensive since the Salesforce acquisition. The purpose of this project was to build an alternative app that I could use for high-quality D3 visualizations while learning about:
- TypeScript
- JS Visualizations (D3)
- Drag-and-drop UIs (react-beautiful-dnd)
- Color picker widgets (react-colorful)

This app. was mostly built for learning purposes and is not being actively developed.

## Quick Start
Note: requires you to install Electron on your machine.

```
git clone https://github.com/ntlind/tableau_electron_app
cd tableau_electron_app
yarn install

# Run dev 
yarn dev

# Build app
yarn build

# Create Electron executable
yarn package
```