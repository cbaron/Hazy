module.exports = Object.assign({}, {
    create: () => {
        const makeModel = fakeMakeModel();
        const weight = fakeWeight();

        // const disc = new DiscType();
        // disc.data = {
        //     make: makeModel.make,
        //     model: makeModel.model,
        //     weight: weight,
        // };
        //
        // return disc;

        return {
            make: makeModel.make,
            model: makeModel.model,
            weight: weight,
        };
    },
});

const arrayRand = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
};

const makesModels = [
    {
        make: 'DiscMania',
        models: [
            'CD Craze',
            'CD3',
            'DD Hysteria',
            'PD Freak',
        ],
    },
    {
        make: 'Discraft',
        models: [
            'Avenger',
            'Crush',
            'Nuke',
        ],
    },
    {
        make: 'Innova',
        models: [
            'Archon',
            'Beast',
            'Katana',
        ],
    },
    {
        make: 'Prodigy',
        models: [
            'D1',
            'D2',
            'D3',
        ],
    },
    {
        make: 'Vibram',
        models: [
            'Lace',
            'Solace',
            'UnLace',
        ],
    },
    {
        make: 'Westside',
        models: [
            'Catapult',
            'Destiny',
            'Fortress',
        ],
    },
];

const fakeMakeModel = () => {
    const makeModel = arrayRand(makesModels);
    const model = arrayRand(makeModel.models);

    return {
        make: makeModel.make,
        model: model,
    };
};

const fakeWeight = () => {
    const min = 100; // grams
    const max = 200; // grams

    return Math.round((Math.random() * (max - min)) + min);
};
