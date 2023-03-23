// "version": human-friendly representation for the version
// "id": path fragment for the version
// "dimmed": true for outdated patch versions or broken docs
CUDA_DOC_VERSIONS = [
  {"version": "Latest", "id": "LATEST", "dimmed": false},

  {"version": "12.0.1", "id": "12.0.1", "dimmed": true},
  {"version": "12.0.0", "id": "12.0.0", "dimmed": false},

  {"version": "11.8.0", "id": "11.8.0", "dimmed": false},

  {"version": "11.7.1", "id": "11.7.1", "dimmed": false},
  {"version": "11.7.0", "id": "11.7.0", "dimmed": true},

  {"version": "11.6.2", "id": "11.6.2", "dimmed": false},
  {"version": "11.6.1", "id": "11.6.1", "dimmed": true},
  {"version": "11.6.0", "id": "11.6.0", "dimmed": true},

  {"version": "11.5.2", "id": "11.5.2", "dimmed": false},
  {"version": "11.5.1", "id": "11.5.1", "dimmed": true},
  {"version": "11.5.0", "id": "11.5.0", "dimmed": true},

  {"version": "11.4.4", "id": "11.4.4", "dimmed": false},
  {"version": "11.4.3", "id": "11.4.3", "dimmed": true},
  {"version": "11.4.2", "id": "11.4.2", "dimmed": true},
  {"version": "11.4.1", "id": "11.4.1", "dimmed": true},
  {"version": "11.4.0", "id": "11.4.0", "dimmed": true},

  {"version": "11.3.1", "id": "11.3.1", "dimmed": false},
  {"version": "11.3.0", "id": "11.3.0", "dimmed": true},

  {"version": "11.2.2", "id": "11.2.2", "dimmed": false},
  {"version": "11.2.1", "id": "11.2.1", "dimmed": true},
  {"version": "11.2.0", "id": "11.2.0", "dimmed": true},

  {"version": "11.1.1", "id": "11.1.1", "dimmed": false},
  {"version": "11.1.0", "id": "11.1.0", "dimmed": true},

  {"version": "11.0 (GA)", "id": "11.0_GA", "dimmed": false},
  {"version": "11.0", "id": "11.0", "dimmed": true},

  {"version": "10.2", "id": "10.2", "dimmed": false},
  {"version": "10.1", "id": "10.1", "dimmed": false},
  {"version": "10.0", "id": "10.0", "dimmed": false},

  {"version": "9.2", "id": "9.2", "dimmed": false},
  {"version": "9.1", "id": "9.1", "dimmed": false},
  {"version": "9.0", "id": "9.0", "dimmed": false},

  {"version": "8.0", "id": "8.0", "dimmed": false}
]

// TODO automatically fetch doc links to avoid maintaining the list.
// https://docs.nvidia.com/cuda/archive/
// https://developer.nvidia.com/cuda-toolkit-archive
