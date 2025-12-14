---
title: Time-Series Correlation Models
---

## Features Used in Prophet Model


**Data Loading and Preparation**

- Loads multiple data sources: historical energy output, future weather forecasts, and official actuals.
- Handles missing files and data validation, ensuring robust preprocessing.
- Converts date columns to datetime and ensures numeric types for calculations.
- Drops invalid or missing rows to maintain data integrity.

**Feature Engineering**

*Time-Based Features*

- Extracts year, month, day, day of week, and day of year from timestamps.
- Flags weekends.
- (Commented out but present) Flags for month start/end and quarter.
- (Commented out) Fourier-based cyclical features for month and day, capturing seasonality.

*Rolling and Statistical Features*

- Calculates rolling statistics (mean, std, max, min, median) for energy output over multiple window sizes (3, 7, 15, 30 days).
- Computes rolling skewness and kurtosis to capture distributional properties.
- Computes rolling volatility (std/mean), range (max-min), and trend (difference over window).
- Exponential moving averages (EMA) for different spans (7, 15, 30 days).
- Rolling ratios between different window sizes for both mean and std.
- Lag features for energy output (lags of 1, 2, 3, 7, 14, 21, 30 days).
- Interaction features (e.g., rolling mean × rolling std).

*Weather and Interaction Features*

- Includes weather variables: temperature, soil moisture, humidity, precipitation.
- (Commented out but present) Polynomial and interaction terms for temperature (squared, cubed), and interactions between temperature and other weather variables.
- Interaction features between temperature and rolling means.

*Missing Value Handling*

- Fills missing numeric values with median or forward/backward fill.
- Replaces infinities with NaN and fills again to ensure no invalid values.

**Modeling Approaches**

*Prophet Model*

- Uses Facebook Prophet with optimized parameters:
    - Increased seasonality complexity (higher Fourier orders for yearly, monthly, quarterly, biweekly).
    - Multiplicative seasonality mode.
    - More changepoints and wider changepoint range for flexibility.
    - Wider prediction intervals for uncertainty.
    - Custom seasonalities added for monthly, quarterly, and biweekly patterns.
- Adds multiple external regressors (weather and engineered features).
- Fits the model to training data and predicts on test and future data.

*Ensemble Machine Learning Models*

- Random Forest Regressor:
    - Tuned for more trees, deeper trees, and robust splitting criteria.
    - Uses all engineered features, including weather and rolling stats.
    - Trained on raw features.
- Ridge Regression:
    - Uses scaled features (RobustScaler for outlier resistance).
    - Regularization parameter tuned for reduced overfitting.
- Both models are trained and evaluated, and their predictions are compared.

*Train-Test Splitting*

- Splits data chronologically to preserve time series order, avoiding data leakage.

**Prediction and Evaluation**

*Prediction Preparation*

- Merges historical and future data to ensure continuity for rolling features.
- Ensures all required regressors are present for Prophet, filling missing ones with zeros if needed.

*Evaluation Metrics*

- Calculates MAE, RMSE, R², MAPE, accuracy percentage, average percent error, and data range for both actual and predicted values.
- Provides detailed printouts for model performance on both cross-validation and official prediction periods.

*Result Saving and Reporting*

- Saves final predictions (with confidence intervals and weather data) to JSON.
- Prints summary tables comparing model performance across all metrics.

---

## Summary Table of Feature Types

| Feature Type | Description |
| :-- | :-- |
| Time-based features | Year, month, day, dayofweek, dayofyear, is_weekend, (quarter, is_month_start/end) |
| Rolling statistics | Mean, std, max, min, median, skew, kurtosis (windows: 3, 7, 15, 30 days) |
| Volatility/trend features | std/mean ratio, range, trend (difference over window) |
| Exponential moving averages | EMA over 7, 15, 30 days |
| Lag features | Energy output at prior 1, 2, 3, 7, 14, 21, 30 days |
| Interaction features | Rolling mean × std, temperature × rolling mean, etc. |
| Weather features | Temperature, soil moisture, humidity, precipitation |
| Polynomial/interactions (weather) | Temperature squared/cubed, temp × moisture, temp × humidity, etc. (some commented out) |
| Model types | Prophet (with regressors and custom seasonalities), Random Forest, Ridge Regression |
| Evaluation metrics | MAE, RMSE, R², MAPE, accuracy, average percent error, data range |





## Summary of the Best XGBoost Parameters

XGBoost offers a wide array of parameters, which can be grouped into three main categories: general parameters, booster parameters, and learning task parameters. Below is a structured summary of the most important and commonly tuned parameters for optimal model performance.

---

**General Parameters**

- **booster**: Type of model to run at each iteration. Options are `gbtree` (default), `gblinear`, or `dart`.
- **device**: Specify computation device (`cpu` or `cuda` for GPU acceleration).
- **verbosity**: Controls the amount of messages printed. Range: 0 (silent) to 3 (debug).
- **nthread**: Number of parallel threads used for running XGBoost.

---

**Tree Booster Parameters (for `gbtree` and `dart`)**


| Parameter | Default | Description | Typical Range |
| :-- | :-- | :-- | :-- |
| eta (learning_rate) | 0.3 | Step size shrinkage to prevent overfitting. Lower values make learning slower but safer. | [0.01, 0.3] |
| gamma | 0 | Minimum loss reduction required to make a split. Higher values make the algorithm more conservative. | [0, ∞) |
| max_depth | 6 | Maximum depth of a tree. Larger values increase model complexity and risk of overfitting. |  |
| min_child_weight | 1 | Minimum sum of instance weight (hessian) in a child. Higher values make the algorithm more conservative. |  |
| subsample | 1 | Fraction of training samples used per tree. Reduces overfitting. | (0.5, 1] |
| colsample_bytree | 1 | Fraction of features used per tree. | (0.5, 1] |
| colsample_bylevel | 1 | Fraction of features used per tree level. | (0.5, 1] |
| colsample_bynode | 1 | Fraction of features used per split. | (0.5, 1] |
| lambda (reg_lambda) | 1 | L2 regularization term on weights. | [0, ∞) |
| alpha (reg_alpha) | 0 | L1 regularization term on weights. | [0, ∞) |
| tree_method | auto | Algorithm for constructing trees: `auto`, `exact`, `approx`, `hist`, `gpu_hist`. |  |
| scale_pos_weight | 1 | Controls balance of positive/negative weights for unbalanced classification. | [1, \#neg/\#pos] |


---

**Learning Task Parameters**

- **objective**: Specifies the learning task (e.g., `reg:squarederror` for regression, `binary:logistic` for binary classification, `multi:softmax` for multiclass).
- **eval_metric**: Evaluation metric for validation data (e.g., `rmse`, `logloss`, `auc`).
- **seed**: Random seed for reproducibility.

---

**Specialized Parameters**

- **DART Booster**: Parameters like `rate_drop`, `skip_drop`, and `sample_type` control dropout behavior in the DART booster.
- **gblinear Booster**: Parameters like `updater`, `feature_selector`, and `top_k` control linear model fitting.
- **Categorical Features**: Parameters such as `max_cat_to_onehot` and `max_cat_threshold` manage categorical data handling.

---

**Parameter Tuning Tips**

- Start with default values and tune the following for best results:
    - `max_depth`, `min_child_weight` (model complexity)
    - `subsample`, `colsample_bytree` (overfitting control)
    - `eta` (learning rate; lower values often require more boosting rounds)
    - `gamma`, `lambda`, `alpha` (regularization)
- For imbalanced datasets, adjust `scale_pos_weight`.
- Use `tree_method=hist` or `gpu_hist` for large datasets or GPU acceleration.

---





## Example of Good XGBoost Parameters



### Typical Ranges for Key Parameters

| Parameter | Typical Range |
| :-- | :-- |
| eta | 0.01 – 0.3 |
| max_leaves | 16 – 256 |
| colsample_bytree | 0.5 – 1.0 |
| subsample | 0.5 – 1.0 |
| alpha/lambda | 0 – 10 |
| min_child_weight | 1 – 10 |


### Why These Parameters Work Well

- **colsample_bytree/colsample_bylevel**: Subsampling features helps reduce overfitting, especially in high-dimensional data[^1][^2].
- **alpha/lambda**: Regularization terms are crucial for controlling model complexity and preventing overfitting, especially with many trees or deep trees[^1][^2][^4].
- **tree_method: 'approx' \& grow_policy: 'lossguide'**: This combination enables efficient training on large datasets, and `lossguide` allows you to control complexity via `max_leaves` instead of `max_depth`[^1][^3].
- **max_leaves**: Directly limits the number of terminal nodes, which is effective for large or sparse datasets[^1][^3].
- **eta**: A moderate learning rate of 0.25 is a reasonable starting point; you can lower it (e.g., 0.05–0.1) for more conservative learning and increase `nrounds` if needed[^5].
- **subsample**: High subsampling (0.95) allows nearly all data to be used but still adds some randomness for regularization[^1][^2].
- **early_stopping_rounds**: Prevents unnecessary training if validation error stops improving[^1][^2].
