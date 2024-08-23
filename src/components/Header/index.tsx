import Image from "next/image"
import Logo from '../../app/favicon.ico'
import '../Header/header.scss'

const Header = () => {
  return (
    <div className='header'>
      <Image className="logo" src={Logo} alt="Sassy-do logo"></Image>
      <div>
        <h1>The Sassy-Do</h1>
        <h4>A sassy todo-list</h4>
      </div>
    </div>
  )
}

export default Header