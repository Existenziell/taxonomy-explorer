import type { FiltersProps } from '@/types'

const speciesClasses = ['all', 'actinopterygii', 'animalia', 'amphibia', 'arachnida', 'aves', 'chromista', 'fungi', 'insecta', 'mammalia', 'mollusca', 'reptilia', 'plantae', 'protozoa', 'unknown']

export default function Filters ({
  filterEndemic,
  setFilterEndemic,
  filterSpeciesClass,
  setFilterSpeciesClass,
}: FiltersProps) {
  const sanitizedClass = filterSpeciesClass === '' ? 'all' : filterSpeciesClass

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setFilterSpeciesClass(value === 'all' ? '' : value)
  }

  return (
    <div className="shadow bg-grey dark:bg-grey-dark p-6 mb-8">
      <p>Filter per taxanomy class:</p>
      <ul className="flex flex-wrap mt-2">
        {speciesClasses.map((c) => (
          <li key={c} className="w-32 mr-8 mt-1 text-sm">
            <label htmlFor={c} className="block cursor-pointer capitalize">
              <input type="radio" id={c} value={c} checked={c === sanitizedClass} onChange={handleChange} className='mr-1' />
              {' '}{c}
            </label>
          </li>
        ))}
      </ul>
      <label htmlFor="endemic" className="mt-4 cursor-pointer flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id="endemic"
          className=" relative bottom-[1px]"
          onChange={() => setFilterEndemic((current) => !current)}
          checked={filterEndemic}
        />
        {' '}Only display endemic species
      </label>
    </div>
  )
}
