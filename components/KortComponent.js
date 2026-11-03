import { useEffect, useRef } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { DANMARK_REGION } from "../data/const";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function KortComponent({ markoerer, region, cirkel, onMarkoerTryk, onKortTryk, style }) {
    const kortRef = useRef(null);

    useEffect(() => {
        if (kortRef.current && region) {
            kortRef.current.animateToRegion(region, 400);
        }
    }, [region?.latitude, region?.longitude, region?.latitudeDelta]);

    return (
        <MapView
            ref={kortRef}
            style={style || GlobalStyle.kortVisning}
            initialRegion={region || DANMARK_REGION}
            onPress={onKortTryk ? (e) => onKortTryk(e.nativeEvent.coordinate) : undefined}
            toolbarEnabled={false}
        >
            {cirkel ? (
                <Circle
                    center={{ latitude: cirkel.latitude, longitude: cirkel.longitude }}
                    radius={cirkel.radiusKm * 1000}
                    strokeColor={FARVER.primaer}
                    fillColor={FARVER.kortCirkel}
                    strokeWidth={2}
                />
            ) : null}
            {(markoerer || []).map((m) => (
                <Marker
                    key={m.id}
                    coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                    title={m.titel}
                    description={m.beskrivelse}
                    pinColor={FARVER.primaer}
                    onCalloutPress={onMarkoerTryk ? () => onMarkoerTryk(m.id) : undefined}
                />
            ))}
        </MapView>
    );
}
