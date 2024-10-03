import math
import networkx
import os
import osmnx
import pickle

# Only run this if gwinnett.graphml and edge_data.pkl do not exist in MapData directory

# Create graph from Gwinnett County and save the largest strongly connected part
if not os.path.exists('MapData/gwinnett.graphml'):
    print("Fetching graph data")
    graph = osmnx.graph_from_place("Gwinnett County, Georgia, USA", network_type='drive')
    graph = osmnx.project_graph(graph)

    largest_component = max(networkx.strongly_connected_components(graph), key=len)
    network = networkx.subgraph(graph, largest_component)

    osmnx.save_graphml(network, 'MapData/gwinnett.graphml')

if not os.path.exists('MapData/edge_data.pkl'):
    print("Calculating edge data")
    # Create edge data
    network = osmnx.load_graphml('MapData/gwinnett.graphml')

    edges = {}

    for u, v, key, data in network.edges(keys=True, data=True):
        length = data['length']
        pos_u = network.nodes[u]
        pos_v = network.nodes[v]

        # Compute direction of edge in degrees
        dx = pos_v['x'] - pos_u['x']
        dy = pos_v['y'] - pos_u['y']
        heading = math.degrees(math.atan2(dy, dx))
        heading = (heading + 360) % 360

        edges[(u, v)] = {
            "length": length,  # Length in meters
            "heading": heading
        }

        # Serialize map edge data
    with open('MapData/edge_data.pkl', 'wb') as f:
        pickle.dump(edges, f)

print("Finished map data setup")



