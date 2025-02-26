import styles from "./loading.less"
import logo from "@/assets/images/logo.png"
import arrowDown from "@/assets/images/arrowDown.png"
import arrowRight from "@/assets/images/arrowRight.png"
import metaMask from "@/assets/images/metaMask.png"
import { Modal,Checkbox } from 'antd';
import React,{useState,useEffect} from 'react'
import {CloseOutlined} from '@ant-design/icons';
import Stars from '@/components/Stars'
import Cards from '@/components/Cards'
import Web3 from "web3";
import Web3Modal from "web3modal";
import {useStorage} from "@/hooks/useStorage.ts"
let web3Modal
let provider
let selectedAccount='';
export default function index(props) {
  const [infos,setInfos] = useStorage("infos")
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [mask, setMask] = useState(false);
  web3Modal = new Web3Modal({
    cacheProvider: false,
    disableInjectedProvider: false, 
  });
  const menu = [
    { id: 1, title: 'Fields' },
    { id: 2, title: 'Resources' },
    { id: 3, title: 'About us' }
  ]
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const onConnect = async () =>{
    // console.log("Opening a dialog", web3Modal);
    try {
      provider = await web3Modal.connect();
      console.log("the wallet connection", provider);
      setVisible(false)
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    if(provider){
      provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
      });
      provider.on("chainChanged", (chainId) => {
        fetchAccountData();
      });
      provider.on("networkChanged", (networkId) => {
        fetchAccountData();
      });
    }
    await refreshAccountData();
  }
  const onDisconnect = async ()=>{
    console.log("Killing the wallet connection", provider);
    await web3Modal.clearCachedProvider();
    provider = null
    selectedAccount = null;
    console.log(provider,selectedAccount);
  }
  const refreshAccountData = async () => {
    await fetchAccountData(provider);
  }
  const fetchAccountData = async() =>{
    setVisible2(false)
    const web3 = new Web3(provider);
    // console.log("Web3 instance is", web3);
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];
    setInfos({ethereum_addr:selectedAccount})
    setVisible2(true)
    // console.log(selectedAccount);
  }
  const connectWallet = async()=>{
    onConnect()
  }
  const showAccount = (str, maxlength=7) => {
    const length = str.length;
    return str.length > maxlength ? str.slice(0, maxlength - 1) + '...' +str.slice(37,length): str
 }
  return (
    <>
      <header>
        <div className={styles.logo}>
          <img src={logo} alt="" />
          <h2>Soul Card</h2>
        </div>
        <div className={styles.nav}>
          <ul>
            {
              menu.map(item => {
                return (
                  <li key={item.id}>
                    <span>{item.title}</span>
                    <img src={arrowDown} alt="" />
                  </li>
                )
              })
            }
          </ul>
          <button onClick={()=>setVisible(true)}>
            <span>
              Log in
            </span>
            <img src={arrowRight} alt="" />
          </button>
        </div>
      </header>
      <main>
        <div className={styles.text}>
          <span className={styles.textLeft}>Realize the you love</span>
          <span className={styles.textRight}>dream</span>
        </div>
        <div className={styles.describe}>
          <p>Showcase your different abilities in different fields of interest<br></br>
            and create value with like-minded people.
          </p>
        </div>
      </main>
      <footer>
        <button className={styles.free} onClick={()=>{
           props.history.push('/home');
        }}>
          Try Soul Card for free
        </button>
      </footer>
      <Modal
          centered
          visible={visible}
          onCancel={()=>{
            setVisible(false)
            setMask(true)
          }}
          width={334}
          mask={true}
          destroyOnClose={mask}
          maskClosable={false}
          maskStyle={{backgroundColor:"black" ,opacity:0.9,animation:'2s'}}
          title={null}
          footer={null}
          modalRender={modal => (
            modal
          )}
          closeIcon={<><CloseOutlined style={{color:"white",fontSize:"20px"}}/></>}
          bodyStyle={{padding: '0px',color:"white"}}
        >
          <div className={styles.modal}>
            <div className={styles.modalTitle}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.modalBody}>
              <h6>
              Connect wallet
              </h6>
              <button onClick={connectWallet}>
                <img src={metaMask} alt="" />
                MetaMask
              </button>
              <p>I don't have a wallet</p>
            </div>
            <div className={styles.modalFooter}>
              <Checkbox onChange={onChange} defaultChecked={true} style={{color:"white",fontFamily: 'Inter',fontWeight:50,fontSize:"5px",lineHeight: '12px'}}>
              I agree to Top5 Terms and Privacy Policy.
              </Checkbox>
            </div>
          </div>
        </Modal>
      <Modal
          centered
          visible={visible2}
          onCancel={()=>{
            setVisible2(false)
            setMask(true)
          }}
          width={334}
          mask={false}
          destroyOnClose={true}
          maskClosable={false}
          title={null}
          footer={null}
          modalRender={modal => (
            modal
          )}
          closeIcon={<><CloseOutlined style={{color:"white",fontSize:"20px"}}/></>}
          bodyStyle={{padding: '0px',color:"white"}}
        >
          <div className={styles.modal2}>
            <div className={styles.modalTitle}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.modalBody}>
              <h6>
              Connect wallet
              </h6>
              <p>Skip approving every interaction with your wallet buy allowing Soulcard to remember you .</p>
              <span>
                {showAccount(selectedAccount)}
              </span>
              <button onClick={()=>{
                setVisible2(false)
                setVisible3(true)
              }}>Remember Me</button>
            </div>
            <div className={styles.modalFooter}>
              <p>
              Signing keys can only sign messgaes and cannot hold funds. They are Stored securely in the browser database system.
              </p>
            </div>
          </div>
        </Modal>
        <Modal
          centered
          visible={visible3}
          onCancel={()=>{
            setVisible3(false)
            setMask(true)
          }}
          width={334}
          mask={false}
          destroyOnClose={true}
          maskClosable={false}
          title={null}
          footer={null}
          modalRender={modal => (
            modal
          )}
          closeIcon={<><CloseOutlined style={{color:"white",fontSize:"20px"}}/></>}
          bodyStyle={{padding: '0px',color:"white"}}
        >
          <div className={styles.modal3}>
            <div className={styles.modalTitle}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.modalBody}>
              <h6>
              Connection Succeeded
              </h6>
              <span>
                √
              </span>
              <button onClick={()=>{
                setVisible3(false)
                setMask(true)
                props.history.push('/detail');
              }}>start</button>
            </div>
          </div>
        </Modal>
        <Stars></Stars>
        <Cards></Cards>
    </>
  )
}
