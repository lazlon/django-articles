import { render } from "solid-js/web"
import { getPhotoApiUrl } from "#/photoApi"
import type { Article, Author, Locale, Tag } from "./types"
import {
  FieldSet,
  TextField,
  SelectField,
  DateField,
  BooleanField,
  PhotoField,
  TagsField,
  LargeTextField,
} from "./fields"

class ArticleFormFields extends HTMLElement {
  static {
    customElements.define("article-form-fields", this)
  }

  connectedCallback() {
    const toggle = document.querySelector<HTMLAnchorElement>("#toggle-sidebar")
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault()
        this.hidden = !this.hidden
      })
    }

    const root = document.createElement("div")
    this.prepend(root)
    render(this.render.bind(this), root)
  }

  private render() {
    const data = JSON.parse(this.getAttribute("attributes")!) as {
      tags: Array<Tag>
      locales: Array<Locale>
      article: Article
      authors: Array<Author>
    }

    const {
      slug,
      subtitle,
      locale,
      author,
      featured,
      visibility,
      published_at,
      feature_image,
      meta_title,
      meta_description,
      og_title,
      og_description,
      og_image,
      twitter_title,
      twitter_description,
      twitter_image,
      code_injection_foot,
      code_injection_head,
    } = data.article.fields

    const photoapi = getPhotoApiUrl(this)
    const authors: Array<[string, string]> = data.authors.map((a) => [
      a.pk,
      a.fields.name,
    ])

    return (
      <>
        <input type="hidden" name="id" value={data.article.pk} />
        <FieldSet open title="Attributes">
          <TextField name="slug" required value={slug || data.article.pk} />
          <SelectField
            name="locale"
            required
            value={locale}
            options={data.locales}
          />
          <SelectField
            name="author"
            required
            value={author}
            options={authors}
          />
          <SelectField
            name="visibility"
            required
            value={visibility}
            options={[
              ["INTERNAL", "Internal"],
              ["PUBLIC", "Public"],
            ]}
          />
          <TextField name="subtitle" value={subtitle} />
          <DateField
            name="published_at"
            label="Schedule"
            value={published_at}
          />
          <BooleanField name="featured" value={featured} />
          <PhotoField
            name="feature_image"
            value={feature_image}
            photoapi={photoapi}
          />
          <TagsField
            name="tags"
            choices={data.tags}
            value={data.article.tags}
          />
        </FieldSet>
        <FieldSet title="Meta Information">
          <TextField name="meta_title" value={meta_title} />
          <LargeTextField name="meta_description" value={meta_description} />
          <TextField name="og_title" value={og_title} />
          <PhotoField name="og_image" value={og_image} photoapi={photoapi} />
          <LargeTextField name="og_description" value={og_description} />
          <TextField name="twitter_title" value={twitter_title} />
          <PhotoField
            name="twitter_image"
            value={twitter_image}
            photoapi={photoapi}
          />
          <LargeTextField
            name="twitter_description"
            value={twitter_description}
          />
        </FieldSet>
        <FieldSet
          open={!!(code_injection_head || code_injection_foot)}
          title="Code Injection"
        >
          <LargeTextField
            name="code_injection_head"
            value={code_injection_head}
          />
          <LargeTextField
            name="code_injection_foot"
            value={code_injection_foot}
          />
        </FieldSet>
      </>
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "article-form-fields": ArticleFormFields
  }
}
