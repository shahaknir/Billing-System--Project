import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

# Load CSV files
user_profiles = pd.read_csv('api_user_profiles.csv')
user_devices = pd.read_csv('USER_DEVICE.csv')
billings = pd.read_csv('BILLING.csv')


# Merge dataframes based on common keys (user_id, device_id, etc.)
merged_data = pd.merge(user_profiles, user_devices, on='user_id')
merged_data = pd.merge(merged_data, billings, on='device_id')

# Feature engineering (example: convert dates to numeric features)
merged_data['status_date'] = pd.to_datetime(merged_data['status_date'])
merged_data['status_day'] = merged_data['status_date'].dt.day
merged_data['status_month'] = merged_data['status_date'].dt.month


# Define features and target variable
features = merged_data.drop(['summary_field'], axis=1)  # Modify based on your data
target = merged_data['summary_field']  # Modify based on your data

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2)

# Train a RandomForestRegressor (example model)
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Generate summaries using the trained model
summaries = model.predict(X_test)

# Print a sample summary
print("Sample Summary:", summaries[0])
