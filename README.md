# Sustainability Tracker - Exercise Project

## Overview
Build a platform that calculates a company's carbon footprint based on EPA data and provides reduction strategies.

## Your Task
Complete the implementation of all the empty functions in `sustainability_tracker.py`. The skeleton provides the structure - you need to fill in the logic.

## Key Components to Implement

### 1. Data Loading (`DataLoader` class)
- Load EPA Excel files
- Validate and clean data
- Handle different file formats

### 2. Data Aggregation (`DataAggregator` class)
- Aggregate emissions by sector
- Aggregate emissions by company
- Calculate trends over time

### 3. Carbon Calculations (`CarbonCalculator` class)
- Calculate total emissions from different sources
- Calculate carbon intensity metrics

### 4. Reduction Strategies (`ReductionStrategies` class)
- Identify high emission areas
- Generate actionable recommendations

### 5. Visualizations (`Visualizations` class)
- Create sector charts
- Create company charts
- Create trend charts
- Create comparison charts

## Getting Started
1. Install dependencies: `pip install -r requirements.txt`
2. Run the app: `streamlit run sustainability_tracker.py`
3. Start implementing the TODO functions

## Data Sources
- EPA Greenhouse Gas Reporting Program (GHGRP)
- EPA Facility Level Information on GreenHouse gases Tool (FLIGHT)
- Consider using data from: https://www.epa.gov/ghgreporting/data-sets

## Expected Features
- Upload and parse EPA Excel files
- Aggregate data by sector, company, or custom groupings
- Interactive visualizations using Plotly
- Carbon footprint calculations
- Reduction strategy recommendations
- Trend analysis

## Tips
- Start with the data loading functionality
- Use sample data for testing before implementing EPA data parsing
- Make the visualizations interactive
- Consider adding data caching for performance
- Add proper error handling throughout