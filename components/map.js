import { MapContainer, TileLayer, Popup, Marker, useMapEvent } from 'react-leaflet';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BlockContent from '@sanity/block-content-to-react';
import styles from './map.module.css';
import 'react-tabs/style/react-tabs.css';

function PositionLogger() {
    const map = useMapEvent('click', (e) => {
        console.log({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    return null;
}

function Labels({ labels }) {
    if (Array.isArray(labels)) {
        return (
            <ul>
                {labels.map((label) => (<Label key={label._id} label={label} />))}
            </ul>
        )
    }
    return null;
}

function Label({ label }) {
    const styleObj = {
        backgroundColor: label.color,
    };
    return (
        <li style={styleObj} className="label">{label.title}</li>
    )
}

function Characters({ characters }) {
    if (Array.isArray(characters)) {
        return (
            <ul>
                {characters.map((character) => (<Character key={character._id} character={character} />))}
            </ul>
        )
    }
    return null;
}

function Character({ character }) {
    const { name, short, description, labels, race, pc, player, image } = character;
    const playerInfo = pc ? ` (player: ${player.name})` : null;
    const raceInfo = race ? ` [${race.name}]` : null;
    return (
        <li className="character">
            <img src={image} />
            <ul>
                <li><strong>{name}{raceInfo}{playerInfo}</strong></li>
                <li><em>{short}</em></li>
                <li><Labels labels={labels} /></li>
            </ul>
        </li>
    )
}
 
function LocationMarker({ location }) {
    return (
        <Marker position={[location.location.lat, location.location.lng]}>
            <Popup maxWidth="auto">
                <h2>{location.name}</h2>
                <section className="location-labels">
                    <Labels labels={location.labels} />
                </section>
                <section className="location-image">
                    <img src={location.image} />
                </section>
                <Tabs>
                    <TabList>
                        <Tab>Story</Tab>
                        <Tab>Description</Tab>
                        <Tab>Characters</Tab>
                    </TabList>
                    <TabPanel>
                        <section className="location-story">
                            <BlockContent blocks={location.story} />
                        </section>
                    </TabPanel>
                    <TabPanel>
                        <section className="location-description">
                            <BlockContent blocks={location.description} />
                        </section>
                    </TabPanel>
                    <TabPanel>
                        <section className="location-characters">
                            <Characters characters={location.characters} />
                        </section>
                    </TabPanel>
                </Tabs>
            </Popup>
        </Marker>
    )
}

export default function Map (props) {
    return (
        <div className={styles.map}>
            <MapContainer center={[70, -110]} zoom={4} maxZoom={6} minZoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution=''
                    url="/tiles/{z}/{x}/{y}.png"
                />
                {props.locations.filter((location) => location.location).map((location) => (
                    <LocationMarker key={location._id} location={location} />
                ))}
                <PositionLogger />
            </MapContainer>
        </div>
    )
};