import { images } from '@/consts/images'
import Image from 'next/image'
import SectionCategoryBarClientWrapper from './_SectionCategoryBar/SelectionCategoryBarClientWrapper'

type Props = {
    onChange?: (category: string) => void
    value?: string
}

const SectionCategoryBar = (props: Props) => {
    const categories = [
        {
            id: 1,
            name: "Dogs",
            image: images.dog.images[1],
        },
        {
            id: 2,
            name: "Cats",
            image: images.cat.images[1],
        },
        {
            id: 3,
            name: "Cows",
            image: images.cow.images[1],
        },
        {
            id: 4,
            name: "Goats",
            image: images.goat.images[1],
        },
        {
            id: 5,
            name: "Sheeps",
            image: images.sheep.images[1],
        },
        {
            id: 6,
            name: "Horses",
            image: images.horse.images[1],
        },
        {
            id: 8,
            name: "Chickens",
            image: images.chicken.images[1],
        },
        {
            id: 9,
            name: "Ducks",
            image: images.duck.images[1],
        },
        {
            id: 12,
            name: "Rabbits",
            image: images.rabbit.images[1],
        },
    ]

    const products = categories.map((category, index) => (
        { name: category, component: <Product key={index} category={category.name} image={category.image} /> }
    ))

    return (
        <SectionCategoryBarClientWrapper onChange={props.onChange} categories={products} value={props.value} />
    )
}

export default SectionCategoryBar

const Product = (props: { category: string, image: string }) => {

    return (
        <div className='cursor-pointer transition-all duration-300 ease-in-out'>
            <Image src={props.image} priority layout='fixed' alt={props.category} width={50} height={50} className={`rounded-full object-cover w-12 h-12`} />
            <div className='text-center text-sm font-semibold'>{props.category}</div>
        </div>
    )
}