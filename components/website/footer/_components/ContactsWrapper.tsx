import { actions } from '@/actions/serverActions/actions'
import Textbox from '@/components/ui/Textbox'
import { useUser } from '@/socket-client/SocketWrapper'
import React, { useEffect, useState } from 'react'
import ContactRow from './ContactsWrapper/ContactRow'
import TheContact from './ContactsWrapper/TheContact'

type Props = {
    children: React.ReactNode
}

const ContactsWrapper = (props: Props) => {
    const [toggled, setToggled] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [contacts, setContacts] = useState([])
    const [searchText, setSearchText] = useState("")
    const [selectedContact, setSelectedContact] = useState<any>(null)
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

    const handleSelectContact = (contact: any) => {
        setSelectedContact(contact)
    }

    return (
        <>
            <section className={`w-[95%] h-[90%] ${toggled ? "translate-y-0 pointer-events-auto z-10 opacity-100" : "translate-y-full pointer-events-none opacity-0 z-0"} transition duration-300 ease-in-out bg-white fixed bottom-0 rounded-t-md text-zinc-700 border border-zinc-300 p-2`}>
                <div className='text-center p-2 text-lg font-bold text-gray-800'>Contacts</div>
                <Textbox className='pl-10' placeholder='Search contacts' value={searchText} onChange={(val: string) => setSearchText(val)} />
                <div className={`w-full h-full max-h-[70%] transition duration-300 p-1 bg-gradient-to-b from-zinc-100 to-transparent mt-2 overflow-y-auto ${isWorking && "grayscale-100 animate-pulse"}`}>
                    {
                        !selectedContact && contacts.length === 0 && (
                            <div>
                                <div className='mt-5 text-center text-zinc-500 italic'>No contacts found</div>
                            </div>
                        )
                    }
                    {
                        !selectedContact && contacts.map((contact: any, index: number) => {

                            if (searchText && searchText.length > 0) {
                                //name and number if not include return null
                                if (!contact.user.name.toLowerCase().includes(searchText.toLowerCase()) && !contact.user.phone.toLowerCase().includes(searchText.toLowerCase())) return null
                            }

                            return (
                                <div key={index} className='w-full'>
                                    <ContactRow contact={contact} onClick={() => handleSelectContact(contact)} />
                                </div>
                            )
                        })
                    }
                    {
                        selectedContact && (
                            <TheContact contact={selectedContact} goBack={() => setSelectedContact(null)} fetchContacts={fetchContacts} />
                        )
                    }
                </div>
                <div onClick={() => { setSelectedContact(null); setSearchText(""); handleToggleMenu(false) }} className='absolute bottom-2 left-1/2 transform -translate-x-1/2 cursor-pointer w-full flex justify-center items-center'>Close</div>
            </section>
            <div onClick={() => { handleToggleMenu(!toggled) }} className=''>{props.children}</div>
            {toggled && <div onClick={() => { setSelectedContact(null); setSearchText(""); handleToggleMenu(false) }} className='inset-0 bg-black/40 backdrop-blur-[1px] fixed top-0 left-0 z-[1]'></div>}
        </>
    )
}

export default ContactsWrapper