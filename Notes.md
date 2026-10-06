<!-- Foundation setup officially completed -->
- Django project ✅
- uv environment ✅
- PostgreSQL Docker mein ✅
- pgAdmin ✅
- .env configuration ✅
- Custom User model ✅
- Initial migrations ✅
  
## Some Notable Doubts and it's Clarification
### 1. `settings.AUTH_USER_MODEL` Kya Hai?
Aapne bilkul sahi samjha! Yeh `settings.py` ke andar `AUTH_USER_MODEL = "users.User"` ki tarah define hota hai.
* **Kyun use karte hain?** Django ke paas apna default User model hota hai. Lekin jab hum resume-ready professional projects banate hain, toh hum apna **Custom User Model** (`users.User`) taiyar karte hain.
* **Kaam kya hai?** Yeh Django ko batata hai ki `Account` table ko default waale user se nahi, balki humare banaye hue custom user model se connect (Foreign Key relation) karna hai.

---

### 2. Django Mein Choice Field Kaise Kaam Karti Hai?
`BANK = "BANK", "Bank"` likhne ka ek strict standard format hota hai. Django isko ek **Tuple (Pair)** ki tarah read karta hai:
👉 `KEY = "DATABASE_VALUE", "DISPLAY_VALUE"`

* **Pehla `"BANK"` (Database Value):** Yeh wo exact value hai jo aapke **PostgreSQL database ke andar** store hogi. Yeh hamesha clean aur backend logic ke liye hoti hai.
* **Doosra `"Bank"` (Display Value):** Yeh wo value hai jo aapke **Frontend, Django Admin panel, ya dropdown forms mein** user ko screen par padhne ke liye dikhegi.
* **Fayda:** Agar kal ko aapko screen par "Bank" ki jagah "Bank Account" ya "Net Banking" dikhana hai, toh database ko bina chhede bas doosri value badal do. Database ka purana data safe rahega.

---

### 3. `auto_now_add` vs `auto_now` Mein Kya Farq Hai?

| Property | Kab execute hoti hai? | Real-life Use Case (ExpenseIQ) |
| :--- | :--- | :--- |
| **`auto_now_add=True`** | Sirf **ek baar** chalta hai jab record database mein **pehli baar create/insert** hota hai. Baad mein yeh kabhi change nahi hota. | `created_at` (Account kab open hua ya Transaction kis exact time par hui). |
| **`auto_now=True`** | Yeh **har baar** chalta hai jab bhi aap us record ke data ko **update ya edit** karke `.save()` karoge. Yeh time automatic badalta rahega. | `updated_at` (Account ka balance kab update hua ya transaction edit kab hui). |

---

### 4. `class Meta` Aur Ordering Ka Logic
Django models ke andar default behavior (setting) ko badalane ke liye **`class Meta`** ka use kiya jata hai. Database se data nikalte waqt sorting set karne ka standard tarika yahi hai.

* **Kaun se order mein data sort ho raha hai?** Aapne model mein `ordering = ["-created_at"]` likha hai.
* **Minus (`-`) sign ka matlab:** Yeh data ko **Descending Order (Newest First)** mein sort karta hai. 
* **Result:** Jo account ya expense user sabse aakhir mein (latest) add karega, wo query chalne par list mein sabse upar dikhega. Agar aap minus hata doge (`["created_at"]`), toh sabse purana data pehle dikhega.

#### 5. After some time noticed, that there is ambiguity in our DB system, actually jo models tables create kr rhe the vo local pgsql, pgadmin pe save hora tha jese account, category table vo local pgsql server / pgadmin p save hra tha, naki docker ke pgsql mein, Esa islie hora tha kyunki locally hmara pgsql server bhi 5432 p chlra tha, ar docker k andar ka pgsql bhi 5432 p chla rkha tha("5432:5432"). To isko Thike krne k lie humne mapping change krdi docker ke pgsql server ki **"5432:5432" se "5433:5432"** krdia, Ab docker ke andar ka pgsql server **5433** pe run krra h.

### 6. Income Model & Relationships
1. **Database Architecture & Relations (One-to-Many)** &rarr;
Income model ke andar `user`, `account`, aur `category` teeno fields mein **`models.ForeignKey`** ka use hua hai. Iska matlab yeh teeno **One-to-Many Relationship** se jude hain:
   - **User ➔ Income (One-to-Many):** Ek User ke paas kai saari (`many`) income entries ho sakti hain, par ek single income entry sirf ek hi user se belong karegi.
   -  **Account ➔ Income (One-to-Many):** Ek Account (e.g., HDFC Bank) mein kai baar paise aa sakte hain, par ek income transaction ek waqt par kisi ek hi account mein credit hogi.
   -  **Category ➔ Income (One-to-Many):** Ek Category (e.g., Salary) multiple income transactions se link ho sakti hai, par ek specific entry ki category ek hi hogi.

2. **`on_delete=models.PROTECT` Ka Master Logic (Interview Special) 🛡️** &rarr; 
Humne `user` par `CASCADE` lagaya hai par `account` aur `category` par `PROTECT` lagaya hai. Yeh ek professional financial system design hai:
   - **`models.CASCADE` (User ke liye):** Agar user apna account hi delete kar de, toh database usse judi saari transaction history automatic delete (wipe out) kar dega.
   - **`models.PROTECT` (Account/Category ke liye):** Yeh database ka strict security guard hai. Agar kisi Bank Account ya Category se pehle se income entries judi hui hain, aur user us account/category ko delete karne jayegi, toh Django use **block** kar dega aur `ProtectedError` throw karega. 
   - **Fayda:** User galti se bhi apni purani financial history barbad nahi kar sakta jab tak wo pehle un transactions ko delete ya shift na kare.
   - **`models.PROTECT` database ka ek aisa security rule hai jo kisi parent record (jaise Bank Account ya Category) ko tab tak delete nahi hone deta jab tak usse judi hui child entries (jaise Income/Expense) database mein maujood hon.**

3. **Multi-Level Ordering `ordering = ["-date", "-created_at"]`**
Django yahan do levels par data sort kar raha hai:
   - **`-date` (Primary Sort):** Saari entries ko unki transaction date ke hisab se **Descending Order (Newest First)** mein lagayega.
   - **`-created_at` (Secondary Sort):** Agar do transactions **ek hi date** par hui hain, toh jo entry baad mein (latest time par) insert hui hai, wo list mein upar dikhegi. Isse passbook ka sequence ekdum sahi rehta hai.

### 7 `__` Lookup field meaning
* Relationship Jump: Django queries ya admin panel mein jab hum double underscore (__) use karte hain, toh use Relationship Lookup kehte hain.
* **Foreign Key Se Connection:** Yeh tab use hota hai jab koi field ek Foreign Key ho. Iska kaam us Foreign Key wale doosre table ke andar ghus kar uski kisi specific field par search ya filter chalana hota ha.
* **Example (category__name):** Iska matlab hai pehle category table par jao, aur phir uske andar maujood name field mein search maaro.
* **Syntax Breakdown:**  `foreignkey_field__target_table_field_name`
* **Kaam:** Jab koi field direct text na hokar ek **Foreign Key** hoti hai, toh `__` lagakar Django us FK ke andar (Targeted Table mein) ghus jata hai aur uske kisi specific field par operation (jaise Search ya Filter) chalata hai.

### 8. DRF + API Structure
#### Core Architectural Decision: User Isolation & Security 
* An intentional decision was made to **exclude** the `user` field from both serializers.
* If we expose the `user` field in the serializer fields like this:
```json
// BAD PRACTICE (Security Risk)
{
    "user": 5,
    "acc_name": "Savings"
}
```
An attacker or malicious user could send a request containing another user's ID (e.g., User B's ID) and alter or access data that does not belong to them.
* Instead API mein authenticated user automatically use hoga
  ```
  [Frontend Request with Auth Token]
               ↓
        request.user  ← (Injected automatically by DRF)
               ↓
   [Account / Category View]
               ↓
       [Database Layer]
  ```

### 9. DRF ViewSets — Deep Dive & Core Concepts

## 📌 The "Why" Behind the Architecture

### Why 'queryset' Variable is NOT Used in AccountViewSet
* **Static Loading:** A class-level `queryset = Model.objects.all()` variable loads exactly once when the Django server boots up.
* **No Request Context:** At boot time, `self.request.user` does not exist because no user has made an HTTP request yet.
* **The Solution:** To perform **Dynamic Filtering** based on whoever is currently logged in, we completely drop the static variable and let the dynamic method handle it.

---
**Strict Naming Rules =>**
The function names **`get_queryset`** and **`perform_create`** are built-in framework hooks. You **must use these exact spellings**. Changing the name (e.g., `get_my_queryset`) will break the override, and DRF will fall back to its default, unsecure automated logic.

#### When to Override ViewSet Methods
- we only write these methods inside a `ModelViewSet` when we need to modify its default automatic behavior:

1. **`get_queryset()`**
   * **When:** Overridden whenever database record visibility depends on conditions.
   * **Purpose:** Security and User Isolation. Restricts database rows so a user can only pull up their own data.

2. **`perform_create()`**
   * **When:** Overridden right before a new row is officially saved to the database.
   * **Purpose:** Implicit Data Injection. Automatically links the row to the logged-in user (`request.user`) safely in the background, keeping the frontend JSON payload secure.

### 10. DRF AUTHENTICATION FLOW
- first installed djangorestframework-simplejwt => `uv pip install djangorestframework-simplejwt`
- Then add simple-jwt config in `settings.py`:
   ```python
  REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
   }

- Then add jwt urls in roots **urls.py**
  ```python
  from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
  )

  urlpatterns = [
      path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
      path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
      path('api/auth/token/verify/', TokenRefreshView.as_view(), name='token_refresh'),
  ]

- After successfully workin of simlejwt, we add **Register API + Logout flow**:
  - for this create `users/serializers.py`
  - **Why create_user()? =>** Because `User.objects.create(...)` password plain text mein save kar sakta hai. Lekin `User.objects.create_user(...)` UserManager ka set_password() use karega, so password properly hashed rahega.
  
- Once Registering Users started working, then know this => JWT uses stateless access tokens, meaning there is no traditional server-side logout. 
- **To implement a proper logout, use `blacklist the refresh token` by setting up a token blacklisting system on the server.**
   - add `"rest_framework_simplejwt.token_blacklist",` in **settings.py**, and run `python manage.py migrate`, this will create the required tables in pgsql.
- #### BlackList ki kahani - About it
  - JWT tokens stateless hote hain (backend unhe database mein save nahi karta). Ab dikkat yeh hai ki agar kisi user ne logout kar diya, par uske paas purana access token abhi bhi pada hai, toh woh bina password ke  API se data nikal sakta hai jab tak token expire na ho!
  - Is security loophole ko khatam karne ke liye hum use karte hain token_blacklist:
  1. **Blacklist ek Jail hai**: Jab user logout karta hai, toh frontend backend ko apna `refresh_token` bhejta hai.
  2. Django us refresh token ko database ki ek **Blacklist (jail) table** mein daal deta hai.
  3. Ab agar woh user ya koi chor us purane token ko lekar dubara aayega, toh Django pehle blacklist table check karega. Agar token jail mein mila, toh Django use block kar dega (`401 Unauthorized`).
  4. **Flow =>** after adding token blacklist and migrating -> create `users/serializers.py`
      ```python
      from rest_framework_simplejwt.serializers import TokenBlacklistSerializer

     class LogoutSerializer(TokenBlacklistSerializer):
         Serializer to handle user logout by blacklisting the provided refresh token.
         Inherits directly from SimpleJWT's TokenBlacklistSerializer.
         pass
   5. After serializer add Logout View in `users/views.py`
      ```python
      from rest_framework import generics
      from rest_framework.permissions import AllowAny, IsAuthenticated
      from rest_framework_simplejwt.views import TokenBlacklistView
      from .serializers import LogoutSerializer, RegisterSerializer
     
      class RegisterView(generics.CreateAPIView):
         serializer_class = RegisterSerializer
         permission_classes = [AllowAny]

      class LogoutView(TokenBlacklistView):
         serializer_class = LogoutSerializer
         permission_classes = [IsAuthenticated] 
      ```
   6. And in last, add url in `users/urls.py` => `path("logout/", LogoutView.as_view(), name="logout"),`
   7. And remember, **Outstanding table - token_blacklist_outstandingtoken** is parent table and **blacklistedtoken table - token_blacklist_blacklistedtoken** is child table.
   
      ***Note: After implementing token_blacklist, we face a bug like on hitting logout url - `api/users/logout/`, i was getting `403 forbidden`, and instead of this i for successfull result of token blacklist it should give `200 OK or 204 No Content` and should give `{}`, and to verify resending again, once token get blaclisted it should show msg - `401 Unauthorized - {"detail":"Token is blacklisted", ...}`, so we were not getting the expected result by default implementation of token_blacklist, so to tackle this we `did force injection in users/views.py` by importing `from rest_framework_simplejwt.authentication import JWTAuthentication ` and adding in `LogoutView - authentication_classes = [JWTAuthentication] # Keep this permanently!`***
        
  - ***Note: Kuch karne ki zaroorat nahi hai, yeh saara jail ka chakkar TokenBlacklistView peeche se khud hi sambhal leta hai!***

   ```python
  Logout request
     ↓
  JWTAuthentication
     ↓
  Access token verify
     ↓
  IsAuthenticated
     ↓
  Refresh token blacklist
     ↓
  200 {}
  ```
- ### Authentication Module - Topics Covered / Done
  - ✅ Register
  - ✅ Login
  - ✅ JWT Access Token
  - ✅ JWT Refresh Token
  - ✅ Protected APIs
  - ✅ Explicit JWT authentication on Logout
  - ✅ Logout
  - ✅ Refresh-token blacklist
  - ✅ PostgreSQL blacklist tables
  - ✅ Blacklisted token reuse rejected

### 11. After successfull implementation, we implement Account API, and User A vs User b Isolation also.
```text
Register/Login
     ↓
Access + Refresh JWT
     ↓
Access Token → Account API request
     ↓
AccountViewSet
     ↓
get_queryset() / perform_create()
     ↓
Serializer
     ↓
Database (PostgreSQL)
```
#### 💬 Interviewer Question
> *"How did you implement CRUD for Accounts?"*

#### 🚀 Recommended Answer
"I used Django REST Framework's `ModelViewSet` for the Account API, which provides the standard CRUD operations such as create, list, retrieve, update, partial update and delete. I customized `get_queryset()` to ensure users can access only their own accounts, and I used `perform_create()` to automatically associate the newly created account with the authenticated user instead of accepting the user ID from the client. JWT authentication identifies the user through `request.user`, and the data is persisted in PostgreSQL through the serializer and Django ORM."

***`get_queryset()` sirf GET ke liye nahi, generally ViewSet ke queryset lookup ko control karta hai. Isliye `retrieve`, `update`, `partial_update`, `destroy` mein bhi ye ownership isolation important hai.***

**Important =>** logic 100% sahi aur ekdum perfect industry standard hai! Financial applications mein kabhi bhi **accounts ya transactions ko database se permanent delete (hard-delete) nahi kiya jata**. Agar delete kar dege, toh poora accounting calculation aur expense history (audit trail) bigad jayega.

### 12. Income App API Implementaion
1. **Field-Level Validation Syntax (The Naming Contract)**
* **Rule:** Jab bhi kisi ek specific field par validation lagani ho forms ya serializers mein, toh function ka naam strictly **`validate_<field_name>`** hi hona chahiye.
* **Why?** DRF backend par dynamically string match karta hai. Agar naam badla (jaise `validateAccount` ya `validated_account`), toh DRF us hook ko skip kar dega.

2. **Under the Hood: Data Transformation**
* **The Magic:** User frontend se sirf ek numeric ID bhejta hai (e.g., `{"account": 3}`).
* **The Reality:** Is function ke andar `account` parameter koi normal integer nahi hota. DRF pehle hi database se query karke use ek **full Model Object instance** bana deta hai.
* **Benefit:** direct object attributes check kar sakte h, jaise `account.user` ya `account.is_active`.

1. **User Extraction via `self.context`**
* **Concept:** Serializers ke paas direct views ki tarah `self.request.user` nahi hota. DRF ek bridge dictionary banta hai jise `self.context` kehte hain, aur request ko uske andar wrap karke serializer ko bhejta hai.
* **How it extracts:** `self.context['request'].user` HTTP Authentication Headers (JWT ya Token) ko padh kar current logged-in user ka database instance nikalta hai.

  ```python
  user = self.context["request"].user  # Extracts the secure user instance
  ```

4. **Core Business Logic Breakdown:**
Humne is pipeline mein do major business checks lagaye hain:
- **A. Data Security Check (Ownership Verification)**
  * **Logic:** `account.user != user` aur `category.user != user`
  * **Reason:** Yeh check lagana zaroori hai taaki koi malicious user API hit karke kisi dusre user ke wallet account ya custom category mein transaction inject na kar sake.
- **B. Accounting & System Health Checks**
  * **Account Status:** `if not account.is_active` blocks entries if a bank account/wallet is frozen or deleted by the user.
  * **Category Type Mismatch:** `category.category_type != Category.CategoryType.INCOME` restricts financial ledger contamination. Yeh ensure karta hai ki Salary income galti se "Food Expense" category ke sath link na ho jaye.

---
#### NOTE: INTERVIEW LEVEL QUESTION / Business Logic question
#### How to prevent a user from creating a transaction using another user's account or into another user's category?
##### Answer => To solve this , implemented field-level serializer validation to enforce ownership and business rules. For example, an authenticated user can only create an Income using their own Account and an Income-type Category. Initially I had an indentation issue where the validation methods were accidentally nested inside Meta, so DRF did not execute them. I rectified it by bring validation methods to the same level of meta and, After correcting the serializer structure, the validation hooks worked as expected.

#### Complete Flow of Income
```text
POST /api/income/
        ↓
JWT Authentication
        ↓
request.user identify
        ↓
IncomeViewSet
        ↓
IncomeSerializer
        ↓
Validate Account
 ├─ current user ka nahi hai? → ❌ reject
 └─ active nahi hai?         → ❌ reject
        ↓
Validate Category
 ├─ current user ki nahi hai? → ❌ reject
 └─ type = INCOME nahi hai?   → ❌ reject
        ↓
perform_create()
        ↓
serializer.save(user=request.user)
        ↓
Income record
        ↓
PostgreSQL
```
#### General CRUD flow
```
Client
  ↓
JWT
  ↓
ViewSet
  ↓
get_queryset() ──→ only current user's Income
  ↓
Serializer
  ↓
Validation
  ↓
Django ORM
  ↓
PostgreSQL
```
#### Aur create mein
```
perform_create()
      ↓
logged-in user automatically attach

*** Isliye client ko ye bhejne ki zarurat nahi: ***
{
   "user": 2
}
*** Backend khud karta hai: ***
serializer.save(user=self.request.user)
```
---

### 13. Account Balance Logic & Architecture
1. **Desired Core Behavior (CRUD vs Balance)**
* **Create:** Nayi income aane par target account ka balance increase hona chahiye.
  ```
  CREATE INCOME ₹50,000 
          ↓
  Income saved
          ↓
  Account balance +₹50,000
  ```
* **Delete:** Income remove hone par target account se amount deduct hona chahiye.
***Income ₹60,000 deleted &rarr; Account balance -₹60,000***
* **Update (Same Account):** Agar amount change hota hai, toh sirf difference adjust hoga.
  ```
  Old Income ₹50,000
  New Income ₹60,000
          ↓
  Difference = +₹10,000
          ↓
  Account balance +₹10,000
  ```
* **Update (Account Swap):** Agar income Account A se Account B mein move hoti hai: ***Old:
Account A +₹50,000 &rarr; New: Account B +₹50,000***

2. **Architectural Decision (Where to put the logic?)**
* **Architecture Flow:** It's best to Keep the serializer responsible *only* for data validation. Aply **Business Logic** inside the **Service Layer / ViewSet Hook** to execute the math and database updates.

  ```text
  Request ➔ ViewSet ➔ Serializer (Validation Only) ➔ Service Layer (Business Logic + Transaction) ➔ DB
  ```

3. **Data Integrity & Race Conditions (`transaction.atomic()`)**
* **The Risk:** Agar income database mein save ho gayi par balance update karte waqt server crash ya validation fail ho gaya, toh ledger mismatched ho jayega.
* **The Solution:** Use Django's **`transaction.atomic()`** block. 
* **Behavior:** Yeh ensure karta hai ki `Income Save` aur `Account Balance Update` dono ek sath complete hon. Agar ek bhi step fail hua, toh database automatically purani state par **Rollback** ho jayega.
***Income DB update + Account balance update &rarr; transaction.atomic()***

### 14. Transactions & ViewSet Logic

#### `transaction.atomic()` ensures that either both *Income save + Account Balance Update* happens together or *else roll-back*.

#### Q1. What does `serializer.save(user=self.request.user)` mean?
* **Actual Work:** It automatically assigns the currently logged-in user to the `user` field of the new Income record before saving it to the database. 
* **Why?** The frontend usually doesn't send the user's ID in the API payload, so Django needs to inject it manually.

---

#### Q2. Why use `update_fields=["acc_balance"]` inside `.save()`?
* **Default Behavior:** `.save()` updates every single column in the table, which causes extra database load.
* **With `update_fields`:** Django executes an optimized SQL query that modifies *only* the `acc_balance` column.
* **Benefit:** Increases database speed and prevents accidental overwriting of other fields by concurrent queries.

---

#### Q3. How to check available parameters inside the `.save()` method?
We can use Python's `inspect` module inside your view to print the signature in the server terminal:
```python
import inspect
from django.db.models import Model
print("SAVE ARGUMENTS:", inspect.signature(Model.save))
# Output includes keys like: force_insert, force_update, using, update_fields
```

---

#### Q4. How does `self.get_object()` fetch data without passing an ID?
* **Behind the scenes:** Django REST Framework (DRF) automatically reads the ID parameter directly from the request URL (e.g., `/api/income/15/`).
* **Purpose:** URL me di gayi ID ko pakadna, automatic database se us record ka poora python object nikalna, aur aapko de dena.
* **Execution:** When you call `self.get_object()`, DRF applies your `get_queryset()` rules, grabs that ID from the URL, and fetches the full record from the database.

---

#### Q5. What is the `instance` argument in `perform_destroy(self, instance)`?
* **Meaning:** `instance` represents the actual database object targeted for deletion.
* **Mechanism:** When a user calls `DELETE /api/income/15/`, DRF fetches the row with ID 15 and automatically injects it into the method as the `instance` variable. The frontend does not need to send any body data.

---

#### Q6. Difference: `self.get_object()` vs `get_object_or_404()`
* **`self.get_object()`**: Built into DRF Class-Based Views. It automatically looks up the URL kwargs, applies your `get_queryset()` filters, and checks object-level security permissions. *(Best for ViewSets)*.
* **`get_object_or_404()`**: A general Django shortcut. You must manually pass the Model name and lookup ID (e.g., `get_object_or_404(Income, id=income_id)`). It performs no automatic permission checks. *(Best for Function-Based Views)*.

---

#### Q7. What is Race Condition?
* **Race Condition:** When multiple API requests try to read and update the exact same database row at the same microsecond, causing data calculation errors.
* **Solution:** Database row locking using `select_for_update()` forces requests to process one after another (sequentially), guaranteeing 100% accurate balances.

#### 📊 HTTP Methods Flow (Income vs Account Balance Summary)
* **POST (Create):** Saves new income ➔ Locks account ➔ Adds amount to balance.
* **GET (Read):** Filtered by `get_queryset()` ➔ Returns only the logged-in user's entries.
* **PUT/PATCH (Update - Case 1):** Same Account ➔ Calculates `new_amount - old_amount` ➔ Adjusts the difference.
* **PUT/PATCH (Update - Case 2):** Account Changed ➔ Subtracts `old_amount` from old account ➔ Adds `new_amount` to new account.
* **DELETE (Destroy):** Locks account ➔ Deducts amount from balance ➔ Deletes income entry.

#### Income Test Results:
| Test | Result |
| :--- | :--- |
| Same amount update | ✅ Balance unchanged |
| Amount increase/decrease | ✅ Difference correctly adjusted |
| Account 3 → Account 4 | ✅ Old account − amount, new account + amount |
| Account 4 → Account 3 | ✅ Reverse transfer bhi correct |
| Delete Income | ✅ Income deleted + balance adjusted |
| Transaction/account consistency | ✅ Working |

### In Same way Expense API Architecture will be set, but with few noticible changes:
1. Income:
```
Create  → +
Update  → - difference
Delete  → +
```
2. Expense:
```
Create  → -
Update  → - difference
Delete  → +
```
3. Account Transfer:
```
Income:
old account −
new account +

Expense:
old account +
new account −
```

## 15. ExpenseIQ — Model & Account Balance Recalibration Logic

This document explains the core double-entry-style mathematical logic used to update, sync, and revert user account balances during Expense transactions inside the Django `views.py`.

---

### 📌 Core Rule of Accounting
> **Account Balance = Actual Available Funds.**
- **Expense Created:** Money goes **OUT** → Balance Decreases (`-`)
- **Expense Deleted/Updated:** Previous action is **REVERSED** → Balance Adjusts accordingly.

---

### 1️⃣ CREATE OPERATION (`perform_create()`)
When a new expense is logged, money is immediately deducted from the selected account.

*   **Formula:** **`Account Balance -= New Expense Amount`**
*   **Example:**
    *   Initial Balance: ₹50,000
    *   New Expense: ₹2,000
    *   *Calculation:* 50,000 - 2,000 = 48,000
    *   **Final Balance:** ₹48,000
* **Isliye:**
  ```python
  account.acc_balance -= expense.amount
  ```
---

### 2️⃣ DESTROY OPERATION (`perform_destroy()`)
When an expense is deleted, the system acts as if the transaction never happened. The previously deducted amount must be refunded/reversed.

*   **Formula:** **`Account Balance += Deleted Expense Amount`**
*   **Example:**
    *   Current Balance: ₹48,000
    *   Deleted Expense: ₹2,000 (already deducted in past)
    *   *Calculation:* 48,000 + 2,000 = 50,000
    *   **Final Balance:** ₹50,000
* **Isliye:**
  ```python
  account.acc_balance += instance.amount

  Yaad rakh:
  CREATE EXPENSE
    → money goes OUT
    → balance -

  DELETE EXPENSE
    → previous deduction reverse
    → balance +
  ```
---

### 3️⃣ UPDATE OPERATION (`perform_update()`)

### 🟢 CASE A: Account Remains the SAME
**If the user only edits the amount but keeps the same account, we only adjust the net difference**.

*   **Formula:** 
    1.  **`Difference = New Amount - Old Amount`**
    2.  **`Account Balance -= Difference`**

*   **Sub-Case 1: Amount Increased (₹2,000 → ₹3,000)**
    *   Current Balance: ₹48,000
    *   *Difference:* 3,000 - 2,000 = +1,000 (Expense increased)
    *   *Calculation:* 48,000 - 1,000 = 47,000
    *   **Final Balance:** ₹47,000
    * **Isliye:**
      ```python
      difference = new_amount - old_amount
      account.acc_balance -= difference
      ```
*   **Sub-Case 2: Amount Decreased (₹3,000 → ₹2,000)**
    *   Current Balance: ₹47,000
    *   *Difference:* 2,000 - 3,000 = -1,000 (Expense decreased)
    *   *Calculation:* 47,000 - (-1,000) = 47,000 + 1,000 = 48,000
    *   **Final Balance:** ₹48,000
    * **Isliye:**
      ```python
      old_account.acc_balance += old_amount
      new_account.acc_balance -= new_amount
      ```
---

### 🔴 CASE B: Account is CHANGED
If the user switches the transaction to a completely different account, we must completely wipe out the effect from the old account and apply the new deduction to the new account.

*   **Formula:**
    1.  **`Old Account Balance += Old Amount`** *(Reverse Old Effect)*
    2.  **`New Account Balance -= New Amount`** *(Apply New Effect)*

*   **Example (Complex: Both Account & Amount Changed):**
    *   Initial States: `Account A` = ₹45,000 | `Account B` = ₹20,000
    *   Old Transaction: ₹5,000 loaded on `Account A`
    *   Updated Transaction: ₹7,000 switched to `Account B`
    *   *Step 1 (Reverse A):* 45,000 + 5,000 = 50,000
    *   *Step 2 (Deduct B):* 20,000 - 7,000 = 13,000
    *   **Final Balances:** `Account A` = ₹50,000 | `Account B` = ₹13,000

---

## 🧠 Master Cheat Sheet: Income vs Expense

| Operation | Income Logic | Expense Logic | Reason/Intent |
| :--- | :--- | :--- | :--- |
| **Create** | `+ amount` | `- amount` | Real-time cash inflow / outflow. |
| **Same Account Update** | `+ difference` | `- difference` | Adjusting the delta change. |
| **Account Change (Old Account)** | `- old_amount` | `+ old_amount` | Reverting the historical transaction effect. |
| **Account Change (New Account)** | `+ new_amount` | `- new_amount` | Routing the new transaction value to the target account. |
| **Delete** | `- amount` | `+ amount` | Restoring the system state prior to the transaction. |

---

## ⚠️ Important Note on Database Concurrency
While the above represents the **Business Logic, data integrity is guarded via PostgreSQL row-level locking:**
*   **`transaction.atomic()`** guarantees that if the Account balance fails to update, the Expense record rollback happens automatically.
*   **`select_for_update()`** locks the account rows until the transaction ends, eliminating data corruption from parallel API requests (Race Conditions).

---
### Expense Tests 
***Same Test Goes For Income Also, Hit income Endpoints.***
```
✅ Create Expense
✅ Read/List Expense
✅ Update Expense amount ↑
✅ Update Expense amount ↓
✅ Transfer Expense Account 3 → 4
✅ Transfer Expense Account 4 → 3
✅ Delete Expense
✅ Balance automatically adjust
✅ Wrong user's account rejected
✅ Wrong user's category rejected
✅ Income category rejected for Expense
✅ Inactive account rejected
✅ Zero amount rejected
✅ Negative amount rejected
✅ User isolation
✅ Transaction + select_for_update() balance safety

Expense API + balance integrity = DONE ✅3
Income CRUD + validation + balance integrity = ✅,
```

### 16. Reconciliation Implementation
* **Reconciliation Meaning:** ***Database ka total aur haath mein bacha asli paisa dono aapas mein match hone chahiye.***
Agar kisi glitch ya miss hue transaction ki wajah se balance upar-neeche hai, toh use dhoondh kar theek karne ke process ko hi Reconciliation kehte hain.
* **Definition:** Reconciliation is the financial process of comparing two sets of records—specifically, the system's calculated wallet/account balances against the actual external bank statements or cash-in-hand—to ensure they are perfectly synchronized and free of discrepancies.

### 17. Implement Search + Pagination + Filtering
* For query filtering, better use package `django-filter`.
* Hum manually type filtering nahi krre like this - `if request.query_params.get(...)`, 
* **Instead:**
  ```text
  Client
   ↓
  Query Parameters
     ↓
  DRF Filter Backends
     ├── DjangoFilterBackend
     ├── SearchFilter
     └── OrderingFilter
     ↓
  User-scoped QuerySet
     ↓
  Pagination
     ↓
  Response
  ```
  Ye industry-standard DRF approach hai aur React frontend ke liye bhi kaafi clean rahega.
  
1. **Core Concepts:**
*   **Filtering:** Exact match targeting (e.g., "Give me only records for Account 3").
*   **Searching:** Substring keyword lookup (e.g., "Find 'Rent' anywhere inside description").
*   **Ordering:** Sorting records up or down based on values (e.g., Highest amount first).
*   **Pagination:** Splitting massive lists into small chunks/pages to optimize network speed.

2. **Hitting Api Requests**
     | Target Goal | Appended URL Parameter Syntax |
      | :--- | :--- |
      | **Exact Filter** | `/api/income/?account=3` |
      | **Multi Filter** | `/api/income/?account=3&category=4` |
      | **Text Search** | `/api/income/?search=dinner` |
      | **Sort Descending** | `/api/income/?ordering=-amount` |
      | **Sort Multiple** | `/api/income/?ordering=-date,amount` |
      | **Mix Everything** | `/api/income/?account=3&search=subway&ordering=-amount` |

### After Completing all this- Last Major Part in Backend - Dashboard API

### 18. Dashboard API - Backend Design
* **Endpoint:** `api/dashboard` that will show the current logged-in user financial summary
  ```python
  {
    "total_income": 85000.00,
    "total_expense": 32000.00,
    "balance": 53000.00,
    "recent_transactions": [
        ...
    ]
  }
  ```
* **Dashboard Data:**
  1. **Total Income:** `SUM(all user's income)`
  2. **Total Expense:** `SUM(all user's expense)`
  3. **Net Balance / Savings:** `total_income - total_expense`
  4. **Account-wise balances:** `"accounts": [
    {
        "id": 3,
        "name": "SBI Salary Account",
        "balance": 45000
    },
    {
        "id": 4,
        "name": "Cash",
        "balance": 8000
    }
  ]`
  5. **Recent transactions:** `Latest income + expense combined, sorted by date.`

* **Important Architecture Point:** We will not manually calculate transaction, instead we will **PostgreSQL aggregation:**
  ```text
  SUM()
  COUNT()
  GROUP BY
  ORDER BY

  Like Importing Sum from Django ORM, to calculate sum of a specific database column across multiple rows.
  ```
* **No need of Model/Migration for Dashboard API, Why?**
  * **Derived Data:** No new data is created in dashboard. Yeh sirf pehle se majood **Income, Expense, aur Account tables** ke data ko jod-tod ke ek summary dikhata hai.
  * **Calculated on the Fly:** Database mein calculations save karne ki jagah hum Django ORM ke Sum(), Count(), aur values() functions use karke real-time summary fetch karte hain.

* **Rough Response for Dashboard:**
  ```python
  {
    "total_income": "50000.00",
    "total_expense": "12000.00",
    "net_balance": "38000.00",
    "total_account_balance": "38000.00",
    "accounts": [
        {
            "id": 3,
            "acc_name": "SBI Salary Account",
            "acc_type": "BANK",
            "acc_balance": "30000.00"
        }
      ],
    "recent_transactions": [
        {
            "type": "expense",
            "id": 5,
            "amount": "500.00",
            "description": "Lunch",
            "date": "2026-10-06",
            "account": "SBI Salary Account",
            "category": "Food"
        }
    ]
  }
  ```
* **Complete Workflow of Dashboard API:**
  ```mermaid
  graph TD
    A[Frontend: GET /api/dashboard/] --> B{IsAuthenticated?};
    B -- No --> C[401 Unauthorized];
    B -- Yes --> D[Extract => request.user];
    D --> E[DB Aggregation: Sum of Income & Expense];
    D --> F[Direct Values: Extract Account Liquidity];
    D --> G[Sliced Fetch: Top 5 Income + Top 5 Expense];
    G --> H[Python: Merge & Dual-key Sort via date/created_at];
    H --> I[Slice Top 5 Final Activities];
    I --> J[Polymorphic Serialization to JSON];
    E --> K[Build Final Response JSON];
    F --> K;
    J --> K;
    K --> L[Return 200 OK Response];
  ```

#### Core Execution Flow:
1. **Authentication Check & User Isolation:**
   * **Access Control:** Sabse pehle `IsAuthenticated` check karta hai ki user logged-in hai ya nahi.
   * **Data Isolation:** `request.user` se current logged-in user ko fetch kiya jata hai taaki user sirf apna hi data dekh sake.

2. **Heavy Lifting by Database (Aggregations):**
   * **Filtering:** Income aur Expense tables mein filter laga hai taaki sirf logged-in user ka data access ho.
   * **DB-Level Sum:** Django `Sum()` aggregation ka use karke saare transactions ka calculation db level par hi kar leta hai.
   * **Fallback Safety:** Aggregation mein `Coalesce` ya `default=0` lagaya gaya hai, taaki agar naya user ho (jiska koi transaction na ho), toh `None` ki jagah `0` return ho aur code crash na kare.

3. **Account Profiling:**
   * **Overhead Reduction:** `.values()` ka use karke direct database se basic columns uthaye jaate hain. Isse Django ke heavy model instances banane ka time aur memory bachti hai.
   * **Balance Consolidation:** Saare accounts ka balance jodkar ek `total_account_balance` calculate kiya jata hai.

4. **Smart Polymorphic Timeline Setup:**
   * **The Challenge:** Kyunki Income aur Expense do alag-alag tables hain, isliye direct ek sath single SQL query chalana mushkil hota hai.
   * **Initial Slicing:** Hum dono tables se alag-alag top-5 items nikalte hain using `[:5]`.
   * **N+1 Query Prevention:** `.select_related('account', 'category')` ka use kiya gaya hai. Isse Django loops chalte waqt foreign key fetch karne ke liye baar-baar database ko hit nahi karta—ek hi JOIN query mein sabhi relations fetch ho jaate hain.

5. **Python In-Memory Sorting:**
   * **Merging:** `itertools.chain` ka use karke dono querysets (Income aur Expense) ko aapas mein bina DB hit kiye combine kiya jata hai.
   * **Sorting:** `sorted()` function ke throw primary `date` aur secondary `created_at` ke base par data ko descending order (`reverse=True`) mein sort kiya jata hai.
   * **Final Slice:** Dobara `[:5]` lagakar combined 10 items mein se absolute top 5 recent transactional activities nikal li jaati hain.

6. **Data Serialization:**
   * **Type Identification:** Ek simple loop chala kar check karte hain ki object `Income` model ka hai ya `Expense` ka.
   * **JSON Mapping:** Data ko ek clean JSON object/dictionary mein convert karke final response array mein append kar diya jata hai.
---

### Related Doubts - Important chize:
Detailed breakdown of structural and optimization mechanics implemented in the custom Dashboard API.
---
1. **Aggregation Syntax (`.aggregate()`)**
   *   **Syntax Breakdown:** `(Model.objects.filter().aggregate(total=Sum('field'))['total'] or 0)`
   *   **The Parentheses `()`:** Implemented strictly for Python code formatting (PEP 8 style). It allows breaking lines across dot-chains (`.filter()`, `.aggregate()`) cleanly without using messy escape slashes (`\`).
   *   **DB Execution:** Aggregation runs entirely inside the db layer (PostgreSQL engine). It does not fetch transaction rows into server memory; it executes an SQL `SUM()` and returns a solitary calculated metric.
   *   **Dictionary Extraction `['total']`:** `.aggregate()` natively returns a Python dictionary (e.g., `{'total': 5000}`). Appending `['total']` extracts the raw integer/float value directly.
   *   **Null-Safeguard (`or 0`):** If a user has no transaction records, the database returns `None` (Null). The short-circuit `or 0` replaces `None` with `0`, preventing mathematical runtime crashes.

2. **Optimization Mechanics (`.values()` & `select_related`)**
   *   **Account `.values()`:** By explicitly passing field names, Django stops the heavy instantiation overhead of complete model instances, like in `.all()`.
   *   **The N+1 Query Trap:** Accessing foreign fields (`transaction.account.acc_name`) inside a loop without pre-fetching forces Django to ping the database for every single loop iteration (causing `N` additional queries).
   *   **`select_related` Solution:** Triggers an SQL `INNER JOIN` at the query stage. Yeh Django ko bolta hai ki database se data fetch karte waqt hi SQL level par INNER JOIN maar do. Yaani Income/Expense table ke sath unki respectve Account aur Category tables ko aapas mein pehle hi chipka do. Isse saara data sirf 1 query mein aa jata hai, aur loop ke andar database par zero hits hote hain!

3. **Combined Polymorphic Timeline Workflow**
   *   **Polymorphic Problem:** `Income` and `Expense` are entirely separate database tables. Django ORM cannot combine or sort them natively using a standard `.order_by()` query.
   *   **`itertools.chain` Operation:** Pairs the independent querysets together into a single flat iterable structure without allocating redundant duplicate blocks of memory.
   *   **Dual-Key Sorting (`sorted()`):** 
       ```python
       key=lambda t: (t.date, t.created_at)  # return tuple as answer
       ```
       Leverages a multi-value sorting tuple. The algorithm sorts chronologically by `date` first. If two entries share the exact same date, it uses `created_at` timestamps to ensure deterministic timeline sequencing.
   *   **Polymorphic Serialization:** Flattens disparate database object structures into a standardized, unified JSON template containing a structural `type` tracker ("income" / "expense") so that UI state engines can readily parse the payload.

4. **Design Patterns: Why `APIView`?**
   *   **`ViewSet` / `ModelViewSet`:** Built exclusively around generating standard CRUD workflows for a single model entity. Completely breaks down when mixing multi-table aggregations.
   *   **`Generic Views` (`ListAPIView`):** Expects a rigid mapping to a single continuous `queryset` and an attached `Serializer`. Custom timeline manipulation violates this design.
   *   **`APIView` Advantage:** Provides bare-metal access over the HTTP verb logic handler. It allows combining 3 standalone entities, evaluating multi-table aggregates, processing local algorithms, and returning an explicit tailored JSON payload.
---
## LEVEL 1 BACKEND FUNCTIONAL MVP — DONE
#### ExpenseIQ — Backend Progress, Topic Covered
```text
Custom User                  ✅
JWT Auth                     ✅
Register/Login/Logout        ✅
Token Blacklisting           ✅
Accounts CRUD                ✅
Categories CRUD              ✅
Income CRUD                  ✅
Expense CRUD                 ✅
Account Balance Sync         ✅
Atomic Transactions          ✅
Concurrency Safety           ✅
User Data Isolation          ✅
Cross-user Validation        ✅
Category Validation          ✅
Inactive Account Protection  ✅
Search                       ✅
Filtering                    ✅
Ordering                     ✅
Pagination                   ✅
Dashboard Aggregation        ✅
Recent Transactions          ✅
Docker + PostgreSQL          ✅
Git + GitHub                 ✅

ExpenseIQ Level 1 Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━
Foundation             ✅
Authentication         ✅
Accounts               ✅
Categories             ✅
Income                 ✅
Expense                ✅
Balance System         ✅
Validation             ✅
Security               ✅
Concurrency            ✅
Search/Filter          ✅
Pagination             ✅
Dashboard              ✅
Docker/PostgreSQL      ✅
Git/GitHub             ✅

LEVEL 1 BACKEND        🟢 COMPLETE
```

#### Aur backend mein tu ye explain kar sakta hai: Interview-Worthy Learning WHYs.

> "Why JWT?"

> "Why user-scoped querysets?"

> "Why transaction.atomic()?"

> "Why select_for_update()?"

> "Why account balance update on transaction create/update/delete?"

> "Why category validation?"

> "How search/filter/pagination works in DRF?"

> "How dashboard aggregation works?"








### 19. Frontend Design
```text
React
 ↓
Authentication flow
 ↓
Dashboard UI
 ↓
Accounts
 ↓
Categories
 ↓
Income
 ↓
Expense
 ↓
Search/filter/pagination UI
 ↓
Charts
 ↓
Responsive UI
```

### Future Roadmap
```
Level 2
Budgets
Recurring expenses
Redis caching
Background tasks
Notifications
Advanced analytics
CSV/PDF exports
Expense sharing
Reconciliation
Level 3
AI financial assistant
Spending analysis
Smart categorization
Financial recommendations
RAG
AI agents
```