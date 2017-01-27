# mangoTools-core

The Mango Tools framework allows you to control your home automation devices ( Loxone, Sonos Hue and many more) from a single api and a unified interface.

The magic happens through the core which is a realtime gateway between the services and the core.

Each control module create and absraction layer to normalise the various supported platform into a single api.

The control modules communicate trough the core via  the great node-ipc (https://github.com/RIAEvangelist/node-ipc) library, which allows modules to be deployed locally on the same machine or through the network.
