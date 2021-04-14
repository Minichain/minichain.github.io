function normalizeVector(inputVector) {
    var vectorLength = inputVector.length;
    var vectorNormalized = [];
    var vectorModule = module(inputVector);
    if (vectorModule > 0) {
        for (var i = 0; i < vectorLength; i++) {
            vectorNormalized.push(inputVector[i] / vectorModule);
        }
    } else {
        vectorNormalized = inputVector;
    }
    return vectorNormalized;
}

function module(vector) {
    var sum = 0;
    for (var i = 0; i < vector.length; i++) {
        sum += Math.pow(vector[i], 2);
    }
    return Math.sqrt(sum);
}