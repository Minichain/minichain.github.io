function computeDistance(vector01, vector02) {
    return Math.sqrt(Math.pow(vector02.x - vector01.x, 2) + Math.pow(vector02.y - vector01.y, 2) + Math.pow(vector02.z - vector01.z, 2));
}