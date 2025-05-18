import { formalizeText, formatCurrency } from '@/lib/utils'
import { Animal } from '@prisma/client'
import React from 'react'

type Props = {
    animal: Animal
}

const CalculatedDescription = (props: Props) => {
    switch (props.animal.priceUnit) {
        case `per ${props.animal.weightUnit}`:
            return PerWeight(props.animal)
        case "per Set":
            return PerSet(props.animal)
        case "per Piece":
            return PerPC(props.animal)
        default:
            return PerPC(props.animal)
    }
}

export default CalculatedDescription
const PerWeight = (animal: Animal) => {
    const quantity = Number(animal.maleQuantityAvailable) + Number(animal.femaleQuantityAvailable);
    return (
        <div>
            <div className='leading-5' >
                <span>I want to sell <span className='font-semibold'>{formalizeText(animal.breed)} {animal.type}{quantity > 1 ? "" : ""}</span> by {animal.priceUnit?.toLocaleLowerCase()}.</span>
                <span> <span className='font-semibold text-lg'>{quantity}</span> {animal.type} with an average weight of {animal.averageWeight} {animal.weightUnit?.toLocaleLowerCase()} each.</span>
                {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                    <span> Average age: {animal.averageAge} {animal.ageUnit.toLowerCase()}.</span>
                )}
                <span> My {String(animal.priceUnit).toLocaleLowerCase()} offer is {formatCurrency(animal.price ?? 0)} which makes a total of <span className='font-semibold tracking-tight text-green-800 text-lg border-b'>{formatCurrency(animal.price * quantity * Number(animal.averageWeight ?? 0))}</span></span>
            </div >
            <div className="w-full my-4 bg-slate-50 px-2 border-b-4 border-slate-400/20 overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody className="text-sm">
                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Selling</td>
                            <td className="py-2">
                                <span className='tracking-wider'>{formalizeText(animal.breed)} {animal.type}</span>
                                <span className="block text-gray-600 text-xs mt-1">
                                    by {animal.priceUnit?.toLowerCase()}
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Details</td>
                            <td className="py-2">
                                <div className="flex gap-4 flex-wrap">
                                    <div>
                                        <span className="font-semibold">{quantity}</span> {animal.type}
                                    </div>
                                    <div>
                                        Avg. {animal.averageWeight} {animal.weightUnit?.toLowerCase()}
                                    </div>
                                    {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                                        <div>
                                            Avg. age: {animal.averageAge} {animal.ageUnit.toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="py-2 pr-4 font-medium">Offer</td>
                            <td className="py-2">
                                <div className="flex flex-col">
                                    <span>{formatCurrency(animal.price ?? 0)}/{animal.priceUnit?.toLowerCase()}</span>
                                    <span className="font-semibold">
                                        {formatCurrency(animal.price * quantity * Number(animal.averageWeight ?? 0))}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const PerSet = (animal: Animal) => {
    const quantity = Number(animal.maleQuantityAvailable) + Number(animal.femaleQuantityAvailable);

    return (
        <div>
            <div className='leading-5'>
                <span>I want to sell <span className='font-semibold'> {quantity} {formalizeText(animal.breed)} {animal.type}{quantity > 1 ? "" : ""}</span> as a complete set.</span>
                {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                    <span> Average age: {animal.averageAge} {animal.ageUnit.toLowerCase()}.</span>
                )}
                <span> My offer is <span className='font-semibold tracking-tight text-green-800 text-lg border-b'>{formatCurrency(animal.price)}</span> as whole set.</span>
            </div>
            <div className="w-full my-4 bg-slate-50 px-2 border-b-4 border-slate-400/20 overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody className="text-sm">
                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Selling</td>
                            <td className="py-2">
                                <span className='tracking-wider'>{formalizeText(animal.breed)} {animal.type} Sets</span>
                                <span className="block text-gray-600 text-xs mt-1">
                                    Complete set of {quantity} available.
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Details</td>
                            <td className="py-2">
                                <div className="flex gap-4 flex-wrap">
                                    {animal.maleQuantityAvailable && animal.maleQuantityAvailable > 0 && <div>
                                        <span className="font-semibold">{animal.maleQuantityAvailable}</span> Male
                                    </div>}
                                    {animal.femaleQuantityAvailable && animal.femaleQuantityAvailable > 0 && <div>
                                        <span className="font-semibold">{animal.femaleQuantityAvailable}</span> Female
                                    </div>}
                                    {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                                        <div>
                                            Avg. age: {animal.averageAge} {animal.ageUnit.toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="py-2 pr-4 font-medium">Pricing</td>
                            <td className="py-2">
                                <div className="flex flex-col">
                                    <span className="font-semibold">
                                        {formatCurrency(animal.price)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const PerPC = (animal: Animal) => {
    const quantity = Number(animal.maleQuantityAvailable) + Number(animal.femaleQuantityAvailable);

    return (
        <div>
            <div className='leading-5'>
                <span>I want to sell <span className='font-semibold'>{formalizeText(animal.breed)} {animal.type}{quantity > 1 ? "" : ""}</span> individually.</span>
                {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                    <span> Average age: {animal.averageAge} {animal.ageUnit.toLowerCase()}.</span>
                )}
                <span> <span className='font-semibold text-lg'>{quantity}</span> {animal.type} available for sale.</span>
                <span> My per piece price is {formatCurrency(animal.price ?? 0)} totaling <span className='font-semibold tracking-tight text-green-800 text-lg border-b'>{formatCurrency(animal.price * quantity)}</span></span>
            </div>
            <div className="w-full my-4 bg-slate-50 px-2 border-b-4 border-slate-400/20 overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody className="text-sm">
                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Selling</td>
                            <td className="py-2">
                                <span className='tracking-wider'>{formalizeText(animal.breed)} {animal.type}</span>
                                <span className="block text-gray-600 text-xs mt-1">
                                    {quantity} individual pieces available
                                </span>
                            </td>
                        </tr>

                        <tr className="border-b border-gray-200">
                            <td className="py-2 pr-4 font-medium">Details</td>
                            <td className="py-2">
                                <div className="flex gap-4 flex-wrap">
                                    {animal.maleQuantityAvailable && animal.maleQuantityAvailable > 0 && <div>
                                        <span className="font-semibold">{animal.maleQuantityAvailable}</span> Male
                                    </div>}
                                    {animal.femaleQuantityAvailable && animal.femaleQuantityAvailable > 0 && <div>
                                        <span className="font-semibold">{animal.femaleQuantityAvailable}</span> Female
                                    </div>}
                                    {(animal.averageAge !== null && animal.averageAge > 0 && animal.ageUnit) && (
                                        <div>
                                            Age: {animal.averageAge} {animal.ageUnit.toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="py-2 pr-4 font-medium">Pricing</td>
                            <td className="py-2">
                                <div className="flex flex-col">
                                    <span>{formatCurrency(animal.price ?? 0)} /piece</span>
                                    <span className="font-semibold">
                                        Total: {formatCurrency(animal.price * quantity)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}