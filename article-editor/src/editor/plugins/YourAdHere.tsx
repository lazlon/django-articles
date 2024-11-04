import "./YourAdHere.css"
import { Block, Icon, Input } from "@/components"
import { BlockPlugin } from "../plugin"
import { Megaphone } from "lucide"

type Data = {
    price: string
    form: string
}

export default BlockPlugin({
    Block: ({ price, form }: Data) => <Block className="YourAdHere">
        <div className=" body cdx-button">
            <span>Advertisment Opportunity</span>
            <div className="row">
                <label>price: </label>
                <Input id="price" placeholder="price">{price}</Input>
            </div>
            <div className="row">
                <label>form: </label>
                <Input id="form" placeholder="form">{form}</Input>
            </div>
        </div>
    </Block>,
    type: "your-ad-here",
    title: "Your Ad Here",
    icon: Icon(Megaphone),
    validate: data => Boolean(data.form && data.price),
    render: ({ price, form }: Data, { trim }) => (
        <your-ad-here attributes={{ price: trim(price), form: trim(form) }} />
    ),
    parse: node => {
        if (node.type == "your-ad-here") {
            return {
                price: node.attributes?.price as string ?? "",
                form: node.attributes?.form as string ?? "",
            }
        }
    },
    save: ({ text }) => ({
        price: text("#price"),
        form: text("#form"),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "your-ad-here": { attributes: Data }
    }
}
