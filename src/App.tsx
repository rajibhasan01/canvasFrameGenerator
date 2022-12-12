import {Col, Container, Row, Form} from 'react-bootstrap';
import {Fragment, useEffect, useRef, useState} from 'react';

function App() {
    const [videoBlob, setVideoBlob] = useState('');
    const [imgArr, setImgArr] = useState<any>([]);

    const handleChange = (e: any) => {
        const urlBlob = URL.createObjectURL(e.target.files[0]);
        setVideoBlob(urlBlob);

    }

    let canvasRef:any = useRef();
    let ctx2:any = canvasRef?.current?.getContext('2d');



    const thumbArr:any = [];

    async function extractFramesFromVideo(timeSpan:any) {
        return new Promise(async (resolve) => {

          // fully download it first (no buffering):
          let video: any = document.createElement('video');
          video.src = videoBlob;

          let seekResolve: any;
          video.addEventListener('seeked', async function() {
            if(seekResolve) seekResolve();
          });

          video.addEventListener('loadeddata', async function() {
            let canvas = document.createElement('canvas');
            let context: any = canvas.getContext('2d');
            let [w, h] = [video.videoWidth, video.videoHeight]
            canvas.width =  w;
            canvas.height = h;

            let interval = timeSpan;
            let currentTime = 0;
            let duration = video.duration;

            while(currentTime < duration) {
              video.currentTime = currentTime;
              await new Promise(r => seekResolve=r);

              context.drawImage(video, 0, 0, w, h);
              canvas.toBlob((blob: any) => {
                    const url:any = URL.createObjectURL(blob);
                    const img = new Image();
                    img.src = url;
                    thumbArr.push(img);
                    setImgArr([...thumbArr]);

                }, 'image/jpeg', 0.95);

              currentTime += interval;
            }
            resolve(thumbArr);
          });
          video.src = videoBlob;

        });
      }
    const handleCanPlay = async(e: any) => {

            let vid:any = document.getElementById('myVid');
            let duration = Math.floor(vid.duration);
            let desireTimeSpan = duration/10;

            await extractFramesFromVideo(desireTimeSpan);


    }




    return (
        <Container>
            <Row>
                <Col md={{span: 10, offset: 1}}>
                    <div className="my-5 border border-2 rounded p-4">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Video File</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="my-4">
                            <video
                                id='myVid'
                                src={videoBlob}
                                autoPlay
                                muted
                                controls
                                className={'w-100 rounded'}
                                onPlay={handleCanPlay}
                            />
                        </div>

                        <div className="my-4 d-flex flex-wrap" id={'frame-wrap'}>
                            <canvas ref={canvasRef} width={800} height={300}/>
                            {imgArr?.map((imgSrc:any, i:any) => {
                                let img = new Image();
                                img.src = imgSrc.currentSrc;
                                ctx2.drawImage(img, i * 80 , 0 , 80, 80)
                            })}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App