# WhatsApp Business Cloud API Setup Guide (`docs/whatsapp-setup.md`)

This guide walks through setting up Meta WhatsApp Cloud API credentials, permanent System User tokens, webhook verification, and the 5 message templates required by the CoreLogic Systems AI Agent.

---

## 1. Create a Meta App & Get `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_APP_SECRET`

1. Sign in to [Meta for Developers](https://developers.facebook.com/apps) using your Meta Business account.
2. Click **Create App** → choose **Other** → **Business** → select your **Business Portfolio** (Meta Business Manager).
3. Inside the app dashboard, find **WhatsApp** and click **Set up**.
4. Navigate to **WhatsApp → API Setup** in the left sidebar:
   - Add and verify the dedicated business phone number for the AI assistant (do **not** use the same number as `OWNER_WHATSAPP_NUMBER`; the bot number sends notifications *to* your personal/owner WhatsApp number).
   - Under **From**, select your business number and copy **Phone number ID** → set this as `WHATSAPP_PHONE_NUMBER_ID`.
5. Navigate to **App Settings → Basic** in the left sidebar:
   - Click **Show** next to **App secret** and copy it → set this as `WHATSAPP_APP_SECRET`.
   - *(Critical: Our webhook uses `WHATSAPP_APP_SECRET` to HMAC-SHA256 verify `X-Hub-Signature-256` on every incoming webhook call.)*

---

## 2. Generate a Permanent `WHATSAPP_ACCESS_TOKEN` (System User)

Temporary tokens shown in **API Setup** expire after 24 hours. For production, create a permanent System User token:

1. Open [Meta Business Settings](https://business.facebook.com/settings).
2. Go to **Users → System Users** → click **Add**:
   - Name: `CoreLogic Website Agent`
   - Role: **Admin**
3. Click **Assign Assets** on the new System User:
   - Under **Apps**, select your WhatsApp Meta App and enable **Manage app (Full control)**.
   - Under **WhatsApp Accounts**, select your WhatsApp Business Account and enable **Manage WhatsApp Business Accounts (Full control)**.
4. Click **Generate New Token**:
   - Select your App.
   - Expiration: **Never**.
   - Select permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
5. Copy the generated token immediately (it is shown only once) → set this as `WHATSAPP_ACCESS_TOKEN`.

---

## 3. Create & Approve the 5 Message Templates in WhatsApp Manager

Open [WhatsApp Manager → Message Templates](https://business.facebook.com/latest/whatsapp_manager/message_templates) and create the 5 **Utility** templates below.

> **Important:** Template names and variable numbers (`{{1}}`, `{{2}}`, ...) must match the table below. Centralized names/locales live in `lib/whatsapp/config.ts` so you can also override them with env vars (`WHATSAPP_TPL_*`, `WHATSAPP_OWNER_TEMPLATE_LANG`, `WHATSAPP_CUSTOMER_LANG_AR`, `WHATSAPP_CUSTOMER_LANG_EN`) without changing logic.

### 3.1 Owner Templates (Language: Arabic `ar` — or match `WHATSAPP_OWNER_TEMPLATE_LANG`)

#### 1) `new_lead_alert`
- **Category:** Utility
- **Language:** Arabic (`ar`)
- **Body:**
  ```text
  عميل محتمل جديد من موقع CoreLogic Systems:
  الاسم: {{1}}
  نوع الطلب: {{2}}
  رقم واتساب: {{3}}
  ملخص المشروع: {{4}}
  ```
- **Variables order:**
  - `{{1}}` = Customer Name
  - `{{2}}` = Request Type (`CONSULTATION`, `QUOTE`, `SUPPORT`, `APPOINTMENT`, `OTHER`)
  - `{{3}}` = Customer WhatsApp Number (E.164)
  - `{{4}}` = Project Summary

#### 2) `booking_request_alert` (with 2 Quick-Reply Buttons)
- **Category:** Utility
- **Language:** Arabic (`ar`)
- **Body:**
  ```text
  طلب حجز موعد استشارة جديد:
  الاسم: {{1}}
  الموعد المطلوب: {{2}}
  رقم العميل: {{3}}
  يرجى اختيار تأكيد أو رفض أدناه:
  ```
- **Buttons (Quick Reply — exact order matters!):**
  - Button 1 (index `0`): **تأكيد** *(Confirm)* — runtime payload injected by server: `BOOKING_CONFIRM:<bookingId>`
  - Button 2 (index `1`): **رفض** *(Reject)* — runtime payload injected by server: `BOOKING_REJECT:<bookingId>`
- **Variables order:**
  - `{{1}}` = Customer Name
  - `{{2}}` = Date & Time in Malaysia Time (MYT)
  - `{{3}}` = Customer WhatsApp Number (E.164)

#### 3) `escalation_alert`
- **Category:** Utility
- **Language:** Arabic (`ar`)
- **Body:**
  ```text
  تنبيه متابعة بشرية من مساعد الموقع:
  السبب: {{1}}
  مرجع المحادثة / العميل: {{2}}
  ```
- **Variables order:**
  - `{{1}}` = Escalation Reason & Urgency
  - `{{2}}` = Conversation ID / Lead Reference

---

### 3.2 Customer Templates (Create in **both** Arabic `ar` and English `en` under the same template name)

Meta WhatsApp Manager allows adding multiple translations (`ar` and `en`) inside the **same** template name. Add both languages for each template below:

#### 4) `booking_confirmed_customer`
- **Category:** Utility
- **Arabic (`ar`) Body:**
  ```text
  مرحباً {{1}}، يسعدنا إبلاغك بتأكيد موعد الاستشارة الخاص بك مع فريق CoreLogic Systems في: {{2}}. سنتواصل معك في الموعد المحدد.
  ```
- **English (`en`) Body:**
  ```text
  Hello {{1}}, your consultation appointment with CoreLogic Systems is confirmed for: {{2}}. Our team looks forward to speaking with you.
  ```
- **Variables order:**
  - `{{1}}` = Customer Name
  - `{{2}}` = Confirmed Date & Time (with MYT timezone label)

#### 5) `booking_rejected_customer`
- **Category:** Utility
- **Arabic (`ar`) Body:**
  ```text
  مرحباً {{1}}، بخصوص طلب الاستشارة في ({{2}})، هذا الوقت لم يعد متاحاً حالياً. سيتواصل معك فريق CoreLogic Systems قريباً لاقتراح وقت بديل يناسبك.
  ```
- **English (`en`) Body:**
  ```text
  Hello {{1}}, regarding your requested consultation slot ({{2}}), that time is unfortunately unavailable. Our team at CoreLogic Systems will follow up shortly to propose an alternative time.
  ```
- **Variables order:**
  - `{{1}}` = Customer Name
  - `{{2}}` = Requested Date & Time (with MYT timezone label)

---

## 4. Configure the Webhook in Meta Developer Portal

1. Generate a random string for `WHATSAPP_VERIFY_TOKEN` (for example: `openssl rand -hex 24`) and add it to your Vercel Production environment variables (along with `WHATSAPP_APP_SECRET`).
2. Deploy the branch/production app so `/api/whatsapp/webhook` is live over HTTPS.
3. In [Meta for Developers](https://developers.facebook.com/apps) → **WhatsApp → Configuration**:
   - Under **Webhook**, click **Edit**.
   - **Callback URL:** `https://www.corelogic-system.my/api/whatsapp/webhook`
   - **Verify token:** paste the exact `WHATSAPP_VERIFY_TOKEN` value.
   - Click **Verify and save** (Meta sends a `GET` request; our endpoint responds `200` with `hub.challenge`).
4. Under **Webhook fields**, click **Manage** and subscribe to **`messages`** (toggle ON).
5. Set `OWNER_WHATSAPP_NUMBER` in Vercel to your personal/owner WhatsApp number in international digits **without `+`** (for example: `601169397149`). Only button taps originating from this exact number are authorized to confirm or reject bookings.
6. Set `WHATSAPP_ENABLED="true"` in Production once all 5 templates show **Approved** in WhatsApp Manager.
