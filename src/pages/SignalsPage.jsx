import { useSignalCore } from '../hooks/useSignalCore';
import { SignalCoreScene } from '../components/scene/SignalCoreScene';
import { Overlay } from '../components/Overlay.jsx';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { coreState, hearts, audioData, shockwave, startRecording, stopRecording } = useSignalCore();

  return (
    <div className="w-full h-screen overflow-hidden bg-background" style={{ height: '100dvh' }}>
      <Helmet>
        <title>Talkie</title>
        <link rel="icon" type="image/png" href="/talkie-ghost.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <SignalCoreScene coreState={coreState} hearts={hearts} audioData={audioData} />
      <Overlay
        coreState={coreState}
        hearts={hearts}
        shockwave={shockwave}
        onStart={startRecording}
        onStop={stopRecording}
      />
    </div>
  );
};

export default Index;
