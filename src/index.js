import { Application, Sprite, Loader, Graphics, Container } from "pixi.js";
import * as PixiSound from "pixi-sound";
import Peer from "peerjs";
import Keyboard from "./keyboard";
const sound = PixiSound.default.sound;

class SlideController {
  constructor() {
    // Bind Funcs:
    this._init = this._init.bind(this);
    this._initPeer = this._initPeer.bind(this);

    this.state = {
      _peer: null,
      _user: {
        type: "viewer", // Can be either viewer, attendee, or presenter.
        peerID: null, // The peer-id of the current user.
        peerConns: [], // Any peer connections this user makes.
        presenterID: null, // The ID of the presenter this user is connected to (...if they're an attendee.)
      },
      _stateMain: {
        _presenterMessage: null,
        set presenterMessage(message) {
          alert(message);
          this._presenterMessage = message;
        },
        slide: 0,
      },
      _statePresenter: {},
    };

    this._init();
  }

  _init() {
    this._initPeer();
  }
  // Initalizes everything to do with peers.
  _initPeer() {
    return new Promise((resolve, reject) => {
      try {
        // The user probably doesn't need peer networking if they're no URL query params.
        if (window.location.search) {
          // First we need to check if the correct url params are there
          // before we create a peer object.
          const urlParams = new URLSearchParams(window.location.search);
          if (!urlParams.get('presenter') && urlParams.get("present") != "true") {
            resolve();
          }
          // Now we know the user probably is either a presenter or a
          // attendee so we create a peer object.
          this.state._peer = new Peer();
          const { _peer, } = this.state;
          // Notify the user if there's errors.
          _peer.on('error', (err) => {
            alert('A fatal error occured, check the console for more details.')
            console.error(err);
          })
          // Unforuntatly because of how peer.js works we need to scope
          // all our code inside this 'on open' scope.
          _peer.on('open', (id) => {
            // Update the peerID.
            const { _user } = this.state;
            _user.peerID = id;

            if (urlParams.get('presenter')) {
              console.log('Attendee')
              // Update the user type to attendee and the presenterID to
              // what we find in the URL params.
              const { presenterID, peerConns } = _user;
              _user.type = 'attendee';
              _user.presenterID = urlParams.get('presenter');
              // Create a connection to the presenter.
              _user.peerConns.push(_peer.connect(presenterID));
              const [presenter] = peerConns;

              console.log(this.state)
              presenter.on('open', function (id) {
                const { _statePresenter, _stateMain } = this.state;
                this.state._statePresenter = {..._stateMain};
                // We're connected!
                alert(`You're connected to the presenter!`)
                resolve();

                // Error handle.
                presenter.on('error', function (err) {
                  console.error(err);
                });

                // When we get data from the presenter we want to update our _statePresenter.
                presenter.on('data', function (data) {
                  console.log("received Data: ", data);
                  Object.keys(data).forEach((e) => {
                    _statePresenter[e] = data[e];
                  });
                });

              });
            } else if (urlParams.get("present") == "true") {
              // Change the user type to presenter.
              _user.type = 'presenter';
              // Give the user their presentation link.
              const { peerID } = _user;
              alert("Entering Presenter-Mode!");
              prompt('Your presenter link is:', `localhost:8000/?presenter=${peerID}`);
              // When a user connects to us...
              console.log(_peer);
              _peer.on("connection", function (conn) {
                // Push their connection to the peerConns array/
                _user.peerConns.push(conn);
                // Then run this code when the connection is completely
                // established.
                conn.on("open", function () {
                  // attendees.push({
                  //   id: conn.id,
                  //   conn: conn,
                  // });

                  // Receive messages
                  // conn.on("data", function (data) {
                  //   console.log("Received", data);
                  // });

                  // Send a connection message.
                  conn.send({
                    presenterMessage: `You're connected! (user No. ${attendees.length})`,
                  });
                });
              });
              // Resolve now that we set up the logic for new 
              // connections.
              resolve();
            }
          });

        }
      } catch (err) {
        reject(err);
      }

    });
  }
}

const currentSession = new SlideController();
// Gives the use keyboard controls to move the .
const initSlideControls = () => {
  const left = Keyboard("ArrowLeft"),
    right = Keyboard("ArrowRight"),
    space = Keyboard("Space");

  left.press = () => {};
};

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

let app = new Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// const loader = new Loader();
// loader
//   .add("song", "sound/song.mp3")

//   .add("knight", "img/knight.png");

// loader.load((loader, resources) => {
//   init(loader, resources);
// });

// const init = (loader, resources) => {
//   let { song, knight } = resources;

//   // song.sound.play();

//   knight = new Sprite(knight.texture);
//   knight.anchor.set(0.5);
//   knight.x = SCREEN_WIDTH / 2;
//   knight.y = SCREEN_HEIGHT / 2;
//   app.stage.addChild(knight);

//   let redSquareContainer = new Container();

//   let redSquare = new Graphics();
//   redSquare.beginFill(0xff0000);
//   redSquare.drawRect(0, 0, 100, 100);
//   redSquare.drawRect(100, 100, 100, 100);
//   redSquare.endFill();

//   redSquareContainer.addChild(redSquare);
//   app.stage.addChild(redSquareContainer);
// };
