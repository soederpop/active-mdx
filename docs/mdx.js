// This file is only necessary because I have problems dynamically importing MDX files
import Api1 from "./api/AstQuery.mdx"
import Api2 from "./api/Document.mdx"
import Api3 from "./api/Collection.mdx"
import Api4 from "./api/Model.mdx"
import Api5 from "./api/NodeShortcuts.mdx"
import Guides1 from "./guides/introduction.mdx"
import Guides2 from "./guides/models/introduction.mdx"
import Guides3 from "./guides/models/querying.mdx"
import Guides4 from "./guides/models/relationships.mdx"
import Guides5 from "./guides/usage/with-nextjs.mdx"
import Index1 from "./index.mdx"
const mdx = {
  "api/AstQuery": Api1,
  "api/Document": Api2,
  "api/Collection": Api3,
  "api/Model": Api4,
  "api/NodeShortcuts": Api5,
  "guides/introduction": Guides1,
  "guides/models/introduction": Guides2,
  "guides/models/querying": Guides3,
  "guides/models/relationships": Guides4,
  "guides/usage/with-nextjs": Guides5,
  "index": Index1,
}
export default mdx
