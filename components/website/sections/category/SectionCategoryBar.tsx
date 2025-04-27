import { images } from '@/consts/images'
import Image from 'next/image'
import SectionCategoryBarClientWrapper from './_SectionCategoryBar/SelectionCategoryBarClientWrapper'

type Props = {
    onChange?: (category: string) => void
}

const SectionCategoryBar = (props: Props) => {
    const categories = ["Dogs", "Cats", "Birds", "Fish", "Reptiles", "Incects"]

    const products = categories.map((category, index) => (
        { name: category, component: <Product key={index} category={category} /> }
    ))

    return (
        <SectionCategoryBarClientWrapper onChange={props.onChange} categories={products} />
    )
}

export default SectionCategoryBar

const Product = (props: { category: string }) => {

    return (
        <div className='cursor-pointer transition-all duration-300 ease-in-out'>
            <Image src={images.chicken.covers[1]} priority layout='fixed' alt={props.category} width={50} height={50} className={`rounded-full object-cover w-12 h-12`} />
            <div className='text-center text-sm font-semibold'>{props.category}</div>
        </div>
    )
}