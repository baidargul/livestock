import { actions } from '@/actions/serverActions/actions'
import Textbox from '@/components/ui/Textbox'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'
import ContactRow from './ContactsWrapper/ContactRow'

type Props = {
    children: React.ReactNode
}

const ContactsWrapper = (props: Props) => {
    const [toggled, setToggled] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [contacts, setContacts] = useState([])
    const [searchText, setSearchText] = useState("")
    const user = useUser()

    const fetchContacts = async () => {
        if (user) {
            setIsWorking(true)
            const response = await actions.client.user.contacts.listAll(user.id)
            if (response.status === 200) {
                setContacts(response.data)
            }
            setIsWorking(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    const handleToggleMenu = (val: boolean) => {
        setToggled(val)
        if (val) {
            fetchContacts()
        }
    }

    return (
        <>
            <section className={`w-[95%] h-[80%] ${toggled ? "translate-y-0 pointer-events-auto z-10 opacity-100" : "translate-y-full pointer-events-none opacity-0 z-0"} transition duration-300 ease-in-out bg-white fixed bottom-14 rounded-t-md text-zinc-700 border border-zinc-300 p-2`}>
                <div className='text-center p-2 text-lg font-bold text-gray-800'>Contacts</div>
                <Textbox placeholder='Search contacts' value={searchText} onChange={(val: string) => setSearchText(val)} />
                <div className={`w-full h-full max-h-[60vh] transition duration-300 p-1 bg-gradient-to-b from-zinc-100 to-transparent mt-2 overflow-y-auto ${isWorking && "grayscale-100 animate-pulse"}`}>
                    {
                        contacts.map((contact: any, index: number) => {

                            if (searchText && searchText.length > 0) {
                                //name and number if not include return null
                                if (!contact.user.name.toLowerCase().includes(searchText.toLowerCase()) && !contact.user.phone.toLowerCase().includes(searchText.toLowerCase())) return null
                            }

                            return (
                                <div key={index} className='w-full'>
                                    <ContactRow contact={contact} />
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            <div onClick={() => { handleToggleMenu(!toggled) }} className=''>{props.children}</div>
            {/* {toggled && <div onClick={() => handleToggleMenu(false)} className='inset-0 bg-black/40 fixed top-0 left-0 z-[1]'></div>} */}
        </>
    )
}

export default ContactsWrapper