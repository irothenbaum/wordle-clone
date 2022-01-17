import './App.css'
import {useCallback, useEffect, useState} from 'react'
import GameMenu from './GameMenu'
import {SCENE_GAME_MULTIPLAYER, SCENE_GAME_REGULAR, SCENE_GAME_REVERSE, SCENE_MENU} from '../lib/constants'
import GameRegular from './GameRegular'
import GameReverse from './GameReverse'

const sceneMap = {
  [SCENE_MENU]: GameMenu,
  [SCENE_GAME_REGULAR]: GameRegular,
  [SCENE_GAME_REVERSE]: GameReverse,
  [SCENE_GAME_MULTIPLAYER]: GameVersus,
}

function App() {
  const [scene, setScene] = useState(SCENE_MENU)
  const [sceneProps, setSceneProps] = useState({})

  const goToScene = (scene, props) => {
    setScene(scene)
    setSceneProps(props)
  }

  const getScene = useCallback(() => {
    const Comp = sceneMap[scene]

    if (!Comp) {
      console.error('Missing component for scene ' + scene)
      return null
    }

    return <Comp {...sceneProps} goToScene={goToScene} />
  }, [scene])

  return <div className="App">{getScene()}</div>
}

export default App
