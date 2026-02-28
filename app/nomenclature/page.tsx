import type { Metadata } from 'next'
import Arrow from '@/components/Arrow'
import { SITE_TITLE } from '@/lib/metadata'

export const metadata: Metadata = {
  title: `Nomenclature & taxonomy — ${SITE_TITLE}`,
  description:
    'Learn how biological taxonomy is organized: ranks from Domain to Species, kingdoms, and how the Taxonomy Explorer filters map onto the tree of life.',
}

interface TreeNode {
  name: string
  description?: string
  children?: TreeNode[]
}

const NOMENCLATURE_TREE: TreeNode[] = [
  {
    name: 'Animalia',
    description: 'Animals — multicellular, eukaryotic organisms that ingest food.',
    children: [
      { name: 'Mammalia', description: 'Mammals: fur, live birth, milk.' },
      { name: 'Aves', description: 'Birds: feathers, beaks, lay eggs.' },
      { name: 'Reptilia', description: 'Reptiles: scaly skin, typically lay eggs.' },
      { name: 'Amphibia', description: 'Amphibians: moist skin, often aquatic larvae.' },
      { name: 'Actinopterygii', description: 'Ray-finned fish: bony skeleton, fins.' },
      { name: 'Insecta', description: 'Insects: six legs, often wings, exoskeleton.' },
      { name: 'Arachnida', description: 'Arachnids: eight legs, e.g. spiders, scorpions.' },
      { name: 'Mollusca', description: 'Molluscs: soft body, often a shell (snails, clams).' },
    ],
  },
  {
    name: 'Plantae',
    description: 'Plants — photosynthetic eukaryotes (trees, grasses, mosses, algae).',
  },
  {
    name: 'Fungi',
    description: 'Fungi — absorb nutrients from surroundings (mushrooms, moulds, yeasts).',
  },
  {
    name: 'Protozoa',
    description: 'Protozoans — single-celled eukaryotes, often motile.',
  },
  {
    name: 'Chromista',
    description: 'Chromists — diverse group including many algae and water moulds.',
  },
  {
    name: 'Unknown',
    description: 'Observations not yet assigned to a major group.',
  },
]

const RANKS = [
  { rank: 'Domain', text: 'The broadest category (e.g. Bacteria, Archaea, Eukarya). Life is grouped into domains before kingdoms.' },
  { rank: 'Kingdom', text: 'Major divisions within a domain. Animalia, Plantae, and Fungi are kingdoms you can filter by in this explorer.' },
  { rank: 'Phylum', text: 'A major group within a kingdom (e.g. Chordata, Mollusca). Phyla group organisms by fundamental body plan.' },
  { rank: 'Class', text: 'A group within a phylum (e.g. Mammalia, Aves). The “species class” filter uses iconic taxa that are often classes.' },
  { rank: 'Order', text: 'A group within a class (e.g. Carnivora, Passeriformes). Orders group related families.' },
  { rank: 'Family', text: 'A group within an order (e.g. Felidae, Rosaceae). Families contain one or more genera.' },
  { rank: 'Genus', text: 'A group of closely related species. The first part of a species’ scientific name (e.g. Panthera in Panthera leo).' },
  { rank: 'Species', text: 'The basic unit of classification. A species is a group of organisms that can interbreed and produce fertile offspring. Shown as cards in the explorer.' },
]

function TaxonomyTree ({ nodes, depth = 0 }: { nodes: TreeNode[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? 'space-y-1' : 'mt-1 ml-4 pl-4 border-l-2 border-level-4 space-y-2'}>
      {nodes.map((node) => (
        <li key={node.name} className="list-none">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-level-6 capitalize">{node.name}</span>
            {node.description != null && (
              <span className="text-sm text-level-5">{node.description}</span>
            )}
          </div>
          {node.children != null && node.children.length > 0 && (
            <TaxonomyTree nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default function NomenclaturePage () {
  return (
    <div className="mx-auto max-w-5xl w-full px-2 pb-16">
      <div className="flex items-center gap-4 mb-2">
        <Arrow direction="left" href="/" ariaLabel="Back to Explorer" />
        <h1 className="title title-hero mb-0">Taxonomy Nomenclature</h1>
      </div>
      <p className="subtitle text-center mx-auto mb-12">
        How life is classified and how the Taxonomy Explorer maps onto the tree of life
      </p>

      <div className="flex flex-col gap-12 p-6 bg-level-2 rounded text-level-6">
        <section>
          <h2 className="section-heading text-level-6">What is taxonomy?</h2>
          <p className="mb-4">
            Taxonomy is the science of naming, defining, and classifying organisms. Biologists use a
            hierarchy of ranks (Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species) to
            group species by shared ancestry and traits. In this explorer, you filter by place and
            by “species class” — these classes are iconic groups (e.g. birds, mammals, insects)
            that correspond to kingdoms or lower ranks in that hierarchy.
          </p>
        </section>

        <section>
          <h2 className="section-heading text-level-6">Taxonomic ranks</h2>
          <p className="mb-4 text-level-5">
            From broadest to most specific, the main ranks are:
          </p>
          <dl className="space-y-3">
            {RANKS.map(({ rank, text }) => (
              <div key={rank}>
                <dt className="font-semibold text-level-6">{rank}</dt>
                <dd className="text-level-5 ml-0 mt-0.5">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="section-heading text-level-6">Kingdoms and iconic taxa in this app</h2>
          <p className="mb-4 text-level-5">
            The filters use “species class” values from iNaturalist. These map onto kingdoms (e.g.
            Animalia, Plantae, Fungi) and, for animals, onto classes or phyla (e.g. Aves, Mammalia,
            Insecta). The tree below shows how these groups relate.
          </p>
        </section>

        <section>
          <h2 className="section-heading text-level-6">Tree of life (groups in this explorer)</h2>
          <p className="mb-4 text-level-5">
            Simplified hierarchy of the kingdoms and iconic taxa you can filter by. Animalia is
            expanded to show the animal classes and phyla used in the app.
          </p>
          <div className="rounded bg-level-3 p-4">
            <TaxonomyTree nodes={NOMENCLATURE_TREE} />
          </div>
        </section>
      </div>
    </div>
  )
}
