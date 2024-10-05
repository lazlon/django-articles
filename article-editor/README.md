# Article Editor

Built with [Editor.js](https://editorjs.io/)

## Usage

```html
<article-editor photoapi="http://mysite.com/api/photo">
  <h2>Heading</h2>
  <p>initial content</p>
</article-editor>

<script>
  const editor = document.querySelector("article-editor")
  editor.addEventListener("input", () => {
    console.log(editor.content)
  })
</script>
```
