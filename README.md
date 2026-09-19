# 🌾 FCA Cash Book

**Developed by: ENGR. JOHN MARK C. CONTILLO**

A **free, simple accounting web app** for Farmers' Cooperatives and Associations (FCA).
It is made to be easy: big buttons, big letters, and plain words — so anyone can use it, even on a phone.

- ✅ Works as a **static website** — no server, no database, no monthly fees
- ✅ Runs perfectly on **GitHub Pages**
- ✅ **Bilingual: English / Ilokano** — tap **EN / ILO** at the top right; the choice is remembered on each device
- ✅ Works **offline** once loaded; records are saved privately on the user's own device (browser)
- ✅ Supports **many cooperatives** — one "book" per group

---

## What it can do

| Feature | Where |
|---|---|
| 💰 Record **Money In** (sales, fees, loans, donations…) | Home screen, big green button |
| 🛒 Record **Money Out** (seeds, fertilizer, wages, transport…) | Home screen, big red button |
| 💵 See **Cash on hand** counted automatically | Home screen |
| 📒 All records with **search** and **filter by month**; edit ✏️ or delete 🗑️ | Records screen |
| 📊 Summary report by month with simple charts | Reports screen |
| 🖨️ **Print** an official-looking cash report (with signature lines) | Reports screen |
| ⬇️ Download records as **CSV** (opens in Excel) | Reports screen |
| 💾 **Backup & Restore** the whole book as one file | Settings screen |
| 📗 One book per cooperative — switch or add from the top menu | Header |
| 🇵🇭 **English ⇄ Ilokano** switch — whole app translates, including categories and printed reports | Top-right **EN / ILO** |

---

## 🖨️ Printable paper version (for manual records)

Included in this folder: **`FCA-Cash-Book-Printable.pdf`** — a 14-page A4 booklet FCAs can print and fill out **by hand** (no computer needed):

1. **Cover page** — cooperative information form + bilingual (English/Ilokano) “how to use” guide
2. **12 cash-book ledger pages** — columns: Date · Particulars · Ref/OR # · Category · Money In (Simrek) · Money Out (Rimmuar) · Balance, with per-page totals and Prepared/Checked signature lines
3. **Monthly Summary page** — 12-month yearly totals with Treasurer / Auditor / Chairperson signature block

Print it, staple it, and hand it to any cooperative. To regenerate or customize it, run `python3 make_printable_pdf.py` (needs `pip install reportlab`).

---

## How to put it on GitHub Pages (step by step)

You only need a free GitHub account. No programming needed.

1. **Create a repository**
   - Go to [github.com](https://github.com) → click **＋** → **New repository**.
   - Name it, for example: `fca-cash-book`. Keep it **Public**. Click **Create repository**.

2. **Upload the files**
   - On the new repository page click **“uploading an existing file”** (or *Add file → Upload files*).
   - Drag in this folder's contents so the structure stays like this:

     ```
     fca-cash-book/
     ├── index.html
     ├── README.md
     ├── css/
     │   └── styles.css
     └── js/
         └── app.js
     ```
     *(Tip: select `index.html`, `README.md` and the `css` and `js` folders together and drop them in.)*
   - Click **Commit changes**.

3. **Turn on GitHub Pages**
   - In your repository go to **Settings** → **Pages** (left menu).
   - Under **Build and deployment**, set **Source** to *Deploy from a branch*,
     **Branch** to `main` and folder `/ (root)`. Click **Save**.

4. **Open your app** 🎉
   - Wait about a minute, then visit:

     ```
     https://YOUR-USERNAME.github.io/fca-cash-book/
     ```

   - Share that link with the cooperatives you assist. They can even add it to their phone's Home Screen and use it like an app.

> 💡 **No GitHub needed at all?** You can also just double-click `index.html` to use it directly on a computer — everything works without internet.

---

## Where are the records saved?

Records are saved **inside the browser of each phone/computer** that uses the app (localStorage). This means:

- It is private — nothing is uploaded anywhere.
- Each device has its own copy. If the treasurer records on her phone, that copy lives on her phone.
- **Important:** clearing browser data also removes the records.

**Recommendation:** once a week (or after every meeting), go to **Settings → Download backup** and keep the file safe (e.g., in Messenger/Email/Drive). To move records to another device, use **Settings → Restore backup**.

---

## Simple guide for members (how to teach it)

0. **Language:** tap **ILO** at the top right to use the app in Ilokano (*Simrek a pirak* = Money In, *Rimmuar a pirak* = Money Out, *Pirak nga adda kadatayo* = Cash on hand).
1. **“Every time money moves, write it down.”**
   - Money came in? Tap the **green button**. Money went out? Tap the **red button**.
2. Fill in: **Date**, **Amount**, pick the **category**, and if possible *who paid / who received* and the **receipt number**.
3. Tap **Save**. Done! The cash balance updates by itself.
4. At month end: open **Reports**, pick the month, then **Print** for the meeting or **Excel (CSV)** for the officer who keeps the official books.
5. New to the app? Tap **“Load sample records to practice”** on the empty Home screen and play with it freely.

---

## For developers

- Pure HTML + CSS + vanilla JS. No build step, no dependencies, no framework.
- Data shape: `{ books: { [id]: { id, name, openingBalance, entries: [{ id, date, type, amount, category, person, ref, note, createdAt }] } }, activeId }` stored under the `fca-cash-book-v1` key.
- Backups are plain JSON of the same shape — easy to migrate or script.
- Suggested improvement ideas: PWA offline install manifest, PIN lock per book, cloud sync via GitHub Gist.

---

**FCA Cash Book** — Developed by **ENGR. JOHN MARK C. CONTILLO** 💚
Made for the Farmers' Cooperatives and Associations of the Philippines.
