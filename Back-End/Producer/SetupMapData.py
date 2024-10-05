import math
import networkx
import os
import osmnx
import pickle


# Only run this if gwinnett.graphml and edge_data.pkl do not exist in MapData directory

def haversine_distance(lat1, lon1, lat2, lon2):
    r = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return r * c


# Create graph from Gwinnett County and save the largest strongly connected part
if not os.path.exists('MapData/gwinnett.graphml'):
    print("Fetching graph data")
    graph = osmnx.graph_from_place("Gwinnett County, Georgia, USA", network_type='drive')

    largest_component = max(networkx.strongly_connected_components(graph), key=len)
    network = networkx.subgraph(graph, largest_component)

    osmnx.save_graphml(network, 'MapData/gwinnett.graphml')

if not os.path.exists('MapData/edge_data.pkl'):
    print("Calculating edge data")
    # Create edge data
    network = osmnx.load_graphml('MapData/gwinnett.graphml')
    edges = {}
    for u, v, key, data in network.edges(keys=True, data=True):
        pos_u = network.nodes[u]
        pos_v = network.nodes[v]

        # Calculate length using haversine distance
        length = haversine_distance(pos_u['y'], pos_u['x'], pos_v['y'], pos_v['x'])

        # Compute direction of edge in degrees
        dx = pos_v['x'] - pos_u['x']
        dy = pos_v['y'] - pos_u['y']
        heading = math.degrees(math.atan2(dy, dx))
        heading = (heading + 360) % 360

        edges[(u, v)] = {
            "length": length,
            "heading": heading,
            "start_lat": pos_u['y'],
            "start_lon": pos_u['x'],
            "end_lat": pos_v['y'],
            "end_lon": pos_v['x']
        }

        # Serialize map edge data
    with open('MapData/edge_data.pkl', 'wb') as f:
        pickle.dump(edges, f)

print("Finished map data setup")
