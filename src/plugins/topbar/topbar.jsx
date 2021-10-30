import React from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./ic-logo-ekara-long-version-white.svg"
import {parseSearch, serializeSearch} from "../../core/utils"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired,
    definitions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url(), selectedIndex: 0, token:null, hiddenTokenInfo:true }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  flushAuthData() {
    const { persistAuthorization } = this.props.getConfigs()
    if (persistAuthorization)
    {
      return
    }
    this.props.authActions.restoreAuthorization({
      authorized: {}
    })
  }

  loadSpec = (url) => {
    this.flushAuthData()
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }



  setSearch = (spec) => {
    let search = parseSearch()
    search["urls.primaryName"] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if(window && window.history && window.history.pushState) {
      window.history.replaceState(null, "", `${newUrl}?${serializeSearch(search)}`)
    }
  }

  setSelectedUrl = (selectedUrl) => {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      if(selectedUrl)
      {
        urls.forEach((spec, i) => {
          if(spec.url === selectedUrl)
            {
              this.setState({selectedIndex: i})
              this.setSearch(spec)
            }
        })
      }
    }
  }

  componentDidMount() {
   
  }

  setToken =()=>{
      let inputToken = document.getElementById("input-token").value
      if(inputToken !== ""){
        
        this.setState({ token: inputToken,hiddenTokenInfo:false})
      }
      if (inputToken && inputToken.trim() !== "") {
        let {definitions,authSelectors,onAuthChange,authorized, getComponent, authActions,errSelectors} = this.props
        inputToken = `Bearer ${inputToken}`
       
        const ApiKeyAuth = getComponent("apiKeyAuth")
        
       
     //  let nonOauthDefinitions = definitions.filter( schema => schema.get("type") !== "oauth2")
      //  console.log(nonOauthDefinitions)
    //   nonOauthDefinitions.map( (schema, name) => {
    //     return <AuthItem
    //       key={name}
    //       schema={schema}
    //       name={name}
    //       getComponent={getComponent}
    //       onAuthChange={this.onAuthChange}
    //       authorized={authorized}
    //       errSelectors={errSelectors}
    //       />
    //   }).toArray()
    console.log( <ApiKeyAuth schema="apiKey"
    name="Authentification"
    errSelectors={ errSelectors }
    authorized={ authorized }
    getComponent={ getComponent }
   value={inputToken} />)
        // authActions.authorizeWithPersistOption(
        //     <ApiKeyAuth schema="apiKey"
        //      name="Authentification"
        //      errSelectors={ errSelectors }
        //      authorized={ authorized }
        //      getComponent={ getComponent }
        //      onChange={ onAuthChange }
        //     value={inputToken} />)
        
       
     }
  }
  render() {
    let { getComponent, specSelectors, getConfigs } = this.props
    const Button = getComponent("Button")
    const AuthorizeBtnContainer = getComponent("AuthorizeBtnContainer", true)
    const Link = getComponent("Link")
    const Input = getComponent("Input")
    const ekaraSwPlaceholder = "Account Id (partner only)"


    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link>
              <img height="40" src={ Logo } alt="Swagger UI"/>
            </Link>
            <div className="set-token-div" style={{float: "right", marginTop: "6px"}}>
        <Input className='input-header' type="text" placeholder={ekaraSwPlaceholder} id="input-clientId"/>
        <AuthorizeBtnContainer />
        <span id="token-is-set" style={{color: "greenyellow"}} hidden={this.state.hiddenTokenInfo}>Token is set</span>
        <span id="token-is-set" hidden>Token is set</span>
      </div>

          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
