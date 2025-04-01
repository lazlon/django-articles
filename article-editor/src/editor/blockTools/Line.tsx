import { Minus } from "lucide-solid"
import { Block } from "../components"
import { BlockTool, defineBlockTool } from "../plugin"
import { asString } from "../utils"

defineBlockTool<{}>({
  type: "line",
  parser: (node) => {
    if (node.type === "hr") return {}
  },
  renderer: () => <hr />,
  toolbox: {
    title: "Line",
    icon: asString(Minus),
  },
  tool: class Line extends BlockTool<{}> {
    defaultData = {}

    render() {
      return (
        <Block>
          <hr class="border-t-[1pt] border-fg/20" />
        </Block>
      )
    }
  },
})
