const flask_server_url = 'http://0.0.0.0:5000';
const refreshPeriod = 300000;

volumesFetcher = new VolumesFetcher(refreshPeriod);

promise = volumesFetcher.getVolumes();

promise.then((data) => {
  console.log(data);
});
