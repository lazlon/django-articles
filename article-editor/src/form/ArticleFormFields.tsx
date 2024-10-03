import type { Article, Author, Locale, Tag } from "./types"
import {
    SelectField,
    TextField,
    BooleanField,
    DateField, PhotoField,
    FieldSet,
    LargeTextField,
    TagsField,
} from "./field"

class ArticleFormFields extends HTMLElement {
    static { customElements.define("article-form-fields", this) }

    connectedCallback() {
        this.prepend(this.render(JSON.parse(this.getAttribute("attributes")!)))
        const toggle = document.querySelector<HTMLAnchorElement>("#toggle-sidebar")
        if (toggle) {
            // this.hidden = true
            toggle.addEventListener("click", e => {
                e.preventDefault()
                this.hidden = !this.hidden
            })
        }
    }

    render = (data: {
        tags: Array<Tag>
        locales: Array<Locale>
        article: Article
        authors: Array<Author>
    }) => {
        const {
            slug,
            subtitle,
            locale,
            author,
            featured,
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

        const authors: Array<[string, string]> = data.authors.map(a => [a.pk, a.fields.name])

        return <div>
            <input type="hidden" name="id" id="id_id" value={data.article.pk} />
            <FieldSet open title="Attributes">
                <TextField name="slug" required value={slug || data.article.pk} />
                <SelectField name="locale" required value={locale} options={data.locales} />
                <SelectField name="author" required value={author} options={authors} />
                <TextField name="subtitle" value={subtitle} />
                <DateField name="published_at" label="Schedule" value={published_at} />
                <BooleanField name="featured" value={featured} />
                <PhotoField name="feature_image" value={feature_image} parent={this} />
                <TagsField name="tags" tags={data.tags} value={data.article.tags} />
            </FieldSet>
            <FieldSet title="Meta Information">
                <TextField name="meta_title" value={meta_title} />
                <LargeTextField name="meta_description" value={meta_description} />
                <TextField name="og_title" value={og_title} />
                <PhotoField name="og_image" value={og_image} parent={this} />
                <LargeTextField name="og_description" value={og_description} />
                <TextField name="twitter_title" value={twitter_title} />
                <PhotoField name="twitter_image" value={twitter_image} parent={this} />
                <LargeTextField name="twitter_description" value={twitter_description} />
            </FieldSet>
            <FieldSet title="Code Injection">
                <LargeTextField name="code_injection_head" value={code_injection_head} />
                <LargeTextField name="code_injection_foot" value={code_injection_foot} />
            </FieldSet>
        </div>
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "article-form-fields": ArticleFormFields
    }
}
