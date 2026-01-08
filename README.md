# 📄 Paginated Rich Text Editor — Next.js + Tiptap

A rich text editor built with **Next.js** and **Tiptap (ProseMirror-powered)** that supports:

✔ Rich text formatting (bold, italic, underline)  
✔ Headings (H1, H2)  
✔ Text alignment (left, center, right)  
✔ Lists (bullet & ordered)  
✔ Links insertion  
✔ Pagination view  
✔ Live word/character/page stats  
✔ Print & HTML export  
✔ Inline BubbleMenu for selected text

---

## 🧠 Features

### Editor UI
- Top toolbar with formatting buttons  
- Pagination view showing page layout  
- Responsive and interactive editor area  
- Inline **BubbleMenu** when selecting text

### Functional
- Word count, character count, page count
- Bold, Italic, Underline, Headings
- Lists (bullet + ordered)
- Text alignment
- Link insertion
- Print support (custom print stylesheet)
- HTML export

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | Frontend & SSR handling |
| React | UI rendering |
| Tiptap (@tiptap/react) | Rich text editor core |
| Tailwind CSS | Styling |
| Floating UI | Bubble menu positioning |
| Lucide Icons | Toolbar icons |

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/paginated-tiptap-editor.git
cd paginated-tiptap-editor
```
Install dependencies:

```bash
  npm install
```

---

## 🛠️ Development
Start the dev server:

```bash
  npm run dev
```
Open your browser:

```arduino
  http://localhost:3000
```

---

## 🧩 How It Works
### Client-only Rendering

Tiptap requires browser APIs and breaks during SSR.
I guard rendering using:

```tsx
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;
```
and enable safe mount with:

```js
   immediatelyRender: false
```

### BubbleMenu

The bubble toolbar appears when text is selected:

```tsx
  <BubbleMenu editor={editor}>
    …buttons…
  </BubbleMenu>
```

---

## 💡 Editor Features
### Toolbar Actions

| Action                  | Behavior                  |
| ----------------------- | ------------------------- |
| Bold                    | Toggles bold formatting   |
| Italic                  | Toggles italic formatting |
| Underline               | Adds underline            |
| H1 / H2                 | Applies heading levels    |
| Align Left/Center/Right | Text alignment            |
| Bullet / Numbered list  | List formatting           |
| Insert Link             | Prompt for URL            |
| Print                   | Native print window       |
| Export                  | Save as HTML file         |

### Pagination

- Based on calculated content height
- Automatically updates as user types
- Shows page numbers & navigates

---

## 📂 File Structure
```scss
src/
├─ app/
│   └─ page.tsx      # Main editor page
├─ components/
│   ├─ ui/
│   │   ├─ button.tsx
│   │   └─ separator.tsx
├─ styles/
│   └─ globals.css
```

---

## 🧪 Notes

- Works only in the browser (no SSR)
- BubbleMenu leverages Floating UI instead of Tippy
- Pagination uses scroll height & fixed page size
