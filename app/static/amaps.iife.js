/* eslint-disable */
// vervangen: ./dist/images/svg/marker.svg => https://map.data.amsterdam.nl/dist/images/svg/marker.svg

var amaps = (function() {
  'use strict';
  function e(e, t) {
    return (t = { exports: {} }), e(t, t.exports), t.exports;
  }
  function t(e) {
    throw e;
  }
  function o(e, t) {
    return Object.assign({}, e, t);
  }
  function n(e) {
    switch (e.type) {
      case 'wmts':
        e.url = e.url + '/' + e.type + '/' + e.layerName + '/' + e.crs + '/{z}/{x}/{y}.' + e.format;
        break;
      case 'tms':
        e.url = e.url + '/' + e.layerName + '/{z}/{x}/{y}.' + e.format;
        break;
      default:
        e.url = e.url + '/' + e.type + '/' + e.layerName + '/' + e.crs + '/{z}/{x}/{y}.' + e.format;
    }
    return e;
  }
  function r(e) {
    var o = e.url.indexOf('{');
    if (o > -1) {
      var n = e.url.indexOf('}');
      'workspacename' === e.url.slice(o + 1, n).toLowerCase()
        ? (e.url = e.url.slice(0, o) + e.workSpaceName + e.url.slice(n + 1, -1))
        : t('only workspacename templates are supported for now');
    }
    return e;
  }
  function a(e) {
    return new Promise(function(t, o) {
      var n = new XMLHttpRequest();
      (n.onreadystatechange = function() {
        4 == n.readyState && 200 == n.status && t(JSON.parse(n.responseText));
      }),
        n.open('GET', e, !0),
        n.send(null);
    });
  }
  function i(e) {
    if (!e.includes('POINT')) throw TypeError('Provided WKT geometry is not a point.');
    var t = e.split('(')[1].split(')')[0];
    return { type: 'Point', coordinates: [parseFloat(t.split(' ')[0]), parseFloat(t.split(' ')[1])] };
  }
  function s(e, t) {
    t.forEach(function(t) {
      e.classList.add(t);
    });
  }
  function l() {
    return ue.MARKER;
  }
  function u() {
    return ue.MAP.extent;
  }
  function c(e) {
    if (e in ue.BASEMAP_PROVIDERS) {
      var t = ue.BASEMAP_PROVIDERS[e];
      return (
        t.deprecated &&
          console &&
          console.warn &&
          console.warn(
            e +
              ' is a deprecated style; it will be redirected to its replacement. For performance improvements, please change your reference.',
          ),
        t
      );
    }
    console.error(
      'NL Maps error: You asked for a style which does not exist! Available styles: ' +
        Object.keys(PROVIDERS).join(', '),
    );
  }
  function d(e, t) {
    var o = void 0;
    return (
      e in ue.WMS_PROVIDERS
        ? (o = ue.WMS_PROVIDERS[e]).deprecated &&
          console &&
          console.warn &&
          console.warn(
            e +
              ' is a deprecated wms; it will be redirected to its replacement. For performance improvements, please change your reference.',
          )
        : ((o = Object.assign({}, ue.WMS_DEFAULTS, t)),
          console.log(
            'NL Maps: You asked for a wms which does not exist! Available wmses: ' +
              Object.keys(ue.WMS_PROVIDERS).join(', ') +
              '. Provide an options object to make your own WMS.',
          )),
      o
    );
  }
  function m(e) {
    e._container.classList.add('nlmaps-marker-cursor');
  }
  function p() {
    var e = u(),
      t = L.latLng(e[0], e[1]),
      o = L.latLng(e[2], e[3]);
    return L.latLngBounds(t, o);
  }
  function f(e) {
    if ('undefined' != typeof L && 'object' === ('undefined' == typeof L ? 'undefined' : de(L))) {
      var t = void 0,
        o = void 0;
      if (void 0 === e) {
        var n = S(map);
        (t = n.latitude), (o = n.longitude);
      } else (t = e.latitude), (o = e.longitude);
      return new L.marker([t, o], {
        alt: 'marker',
        icon: new L.icon({ iconUrl: l().url, iconSize: l().iconSize, iconAnchor: l().iconAnchor }),
      });
    }
  }
  function g(e) {
    if ('undefined' != typeof L && 'object' === ('undefined' == typeof L ? 'undefined' : de(L)))
      return L.nlmapsBgLayer(e);
  }
  function y(e, t) {
    if ('undefined' != typeof L && 'object' === ('undefined' == typeof L ? 'undefined' : de(L)))
      return L.nlmapsOverlayLayer(e, t);
  }
  function v(e) {
    if ('undefined' != typeof L && 'object' === ('undefined' == typeof L ? 'undefined' : de(L)))
      return L.geoLocatorControl(e);
  }
  function b(e, t) {
    t.fitBounds(L.geoJSON(e).getBounds(), { maxZoom: 18 });
  }
  function h(e, t) {
    var o = ce.createControl(b, e, t);
    e.getContainer().parentElement.insertBefore(o, e.getContainer().parentElement[0]);
  }
  function S(e) {
    var t = e.getCenter();
    return { latitude: t.lat, longitude: t.lng };
  }
  function w() {
    var e = c(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'standaard');
    if (e.subdomains) {
      var t = e.subdomains;
      e.url = e.url.replace('{s}', '{' + t.slice(0, 1) + '-' + t.slice(-1) + '}');
    }
    if ('object' === ('undefined' == typeof ol ? 'undefined' : de(ol)))
      return new ol.layer.Tile({
        source: new ol.source.XYZ({ url: e.url, attributions: [new ol.Attribution({ html: e.attribution })] }),
      });
    throw 'openlayers is not defined';
  }
  function E(e) {
    var t = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [32, 63],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: l().url,
          scale: 1,
        }),
      }),
      o = void 0,
      n = void 0;
    if (void 0 === e) {
      var r = R(map);
      (o = r.latitude), (n = r.longitude);
    } else (o = e.latitude), (n = e.longitude);
    var a = ol.proj.fromLonLat([n, o]),
      i = new ol.Feature({ geometry: new ol.geom.Point(a), name: 'marker' });
    i.setStyle(t);
    var s = new ol.source.Vector({ features: [i] });
    return new ol.layer.Vector({ source: s });
  }
  function C(e, t) {
    var o = d(e, t);
    if ('object' === ('undefined' == typeof ol ? 'undefined' : de(ol)))
      return new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: o.url,
          serverType: 'geoserver',
          params: { LAYERS: o.layerName, VERSION: o.version, STYLES: o.styleName },
        }),
      });
    throw 'openlayers is not defined';
  }
  function k(e, t) {
    function o(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t,
        o = t.getView().getZoom(),
        n = new ol.View({ center: ol.proj.fromLonLat([e.coords.longitude, e.coords.latitude]), zoom: o });
      t.setView(n);
    }
    var n = document.createElement('div');
    return (
      (n.className = 'nlmaps-geolocator-control ol-control'),
      n.addEventListener('click', function() {
        e.start();
      }),
      e.on('position', function(e) {
        o(e, t);
      }),
      new ol.control.Control({ element: n })
    );
  }
  function _(e, t) {
    var o = ol.proj.fromLonLat(e.coordinates);
    t.getView().setCenter(o), t.getView().setZoom(18);
  }
  function R(e) {
    var t = e.getView().getCenter(),
      o = ol.proj.toLonLat(t);
    return { longitude: o[0], latitude: o[1] };
  }
  function A(e) {
    var t = ce.createControl(_, e);
    (t = new ol.control.Control({ element: t })), e.addControl(t);
  }
  function M(e, t) {
    if ('object' === ('undefined' == typeof google ? 'undefined' : de(google)) && 'object' === de(google.maps)) {
      var o = document.createElement('div');
      (o.style.backgroundColor = '#fff'),
        (o.style.opacity = '0.7'),
        (o.style.border = '2px solid #fff'),
        (o.style.cursor = 'pointer'),
        e.appendChild(o);
      var n = document.createElement('div');
      return (
        (n.style.color = 'rgb(25,25,25)'),
        (n.style.fontFamily = 'Roboto,Arial,sans-serif'),
        (n.style.fontSize = '10px'),
        (n.innerHTML = t),
        o.appendChild(n),
        (e.index = 1),
        e
      );
    }
    throw 'google is not defined';
  }
  function T(e, t) {
    var o = document.createElement('div');
    return (
      (o.id = 'nlmaps-geolocator-control'),
      (o.style.backgroundColor = '#fff'),
      (o.style.cursor = 'pointer'),
      (o.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.65)'),
      (o.style.height = '26px'),
      (o.style.width = '26px'),
      (o.style.borderRadius = '26px 26px'),
      (o.style.margin = '.5em'),
      o.addEventListener(
        'click',
        function() {
          e.start();
        },
        this,
      ),
      e.on('position', function(e) {
        t.setCenter({ lat: e.coords.latitude, lng: e.coords.longitude });
      }),
      o
    );
  }
  function x(e, t) {
    t.setCenter({ lat: e.coordinates[1], lng: e.coordinates[0] }), t.setZoom(18);
  }
  function O(e, t) {
    return e.getArray().indexOf(t);
  }
  function P(e, t) {
    var o = t.getMapTypeId(),
      n = t.controls[google.maps.ControlPosition.BOTTOM_RIGHT],
      r = O(n, e);
    'roadmap' === o || 'hybrid' === o || 'sattelite' === o ? r > -1 && n.removeAt(r) : -1 === r && n.push(e);
  }
  function I() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : e,
      t = arguments[1],
      o = new M(document.createElement('div'), t);
    e.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(o),
      e.addListener('maptypeid_changed', function() {
        return P(o, e);
      });
  }
  function N(e) {
    return {
      getTileUrl: function(t, o) {
        return e.bare_url + '/' + o + '/' + t.x + '/' + t.y + '.png';
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: !0,
      name: e.name,
      maxZoom: e.maxZoom,
      minZoom: e.minZoom,
    };
  }
  function z(e) {
    return {
      baseUrl: e.url,
      layers: e.layers,
      styles: e.styles,
      format: e.format,
      transparent: e.transparent,
      opacity: 0.7,
    };
  }
  function B(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'standaard';
    if ('object' === ('undefined' == typeof google ? 'undefined' : de(google)) && 'object' === de(google.maps)) {
      var o = c(t),
        n = N(o),
        r = new google.maps.ImageMapType(n),
        a = e || this.map || 'undefined';
      return void 0 !== a && I(a, o.attribution), r;
    }
    throw 'google is not defined';
  }
  function U(e) {
    var t = e.lat(),
      o = e.lng();
    if (!(Math.abs(o) > 180 || Math.abs(t) > 90)) {
      var n = 0.017453292519943295 * t;
      return {
        x: 6378137 * (0.017453292519943295 * o),
        y: 3189068.5 * Math.log((1 + Math.sin(n)) / (1 - Math.sin(n))),
      };
    }
  }
  function j(e, t) {
    var o = {
        getTileUrl: function(o, n) {
          var r = e.getProjection(),
            a = Math.pow(2, n),
            i = r.fromPointToLatLng(new google.maps.Point((256 * o.x) / a, (256 * o.y) / a)),
            s = r.fromPointToLatLng(new google.maps.Point((256 * (o.x + 1)) / a, (256 * (o.y + 1)) / a)),
            l = U(i),
            u = U(s),
            c = l.x + ',' + u.y + ',' + u.x + ',' + l.y,
            d = t.baseUrl;
          return (
            (d += 'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3857'),
            (d += '&WIDTH=256'),
            (d += '&HEIGHT=256'),
            (d += '&LAYERS=' + t.layers),
            (d += '&STYLES=' + t.styles),
            (d += '&BBOX=' + c),
            (d += '&FORMAT=' + t.format),
            (d += '&TRANSPARENT=' + t.transparent)
          );
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: !0,
      },
      n = new google.maps.ImageMapType(o);
    return n.setOpacity(t.opacity), e.overlayMapTypes.push(n);
  }
  function D() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : e,
      t = new j(e, z(d(arguments[1], arguments[2])));
    return (t.name = 'wms'), t;
  }
  function Z(e) {
    var t = void 0,
      o = void 0;
    if (void 0 === e) {
      var n = V(map);
      (t = n.latitude), (o = n.longitude);
    } else (t = e.latitude), (o = e.longitude);
    var r = new google.maps.LatLng(t, o);
    return new google.maps.Marker({ title: 'marker', position: r, icon: l().url });
  }
  function V(e) {
    return { latitude: e.getCenter().lat(), longitude: e.getCenter().lng() };
  }
  function F(e) {
    var t = ce.createControl(x, e);
    e.getDiv().appendChild(t);
  }
  function W(e) {
    this.emit('position', e);
  }
  function G(e) {
    this.emit('error', e);
  }
  function q(e) {
    var t = 'undefined' != typeof window ? window.navigator || {} : {};
    if (void 0 !== t && 'geolocation' in t) {
      var o = me(fe(e));
      return (
        o.on('position', function() {
          this.stop();
        }),
        o
      );
    }
    throw 'geolocation is not available in your browser.';
  }
  function H(e) {
    return new Promise(function(t, o) {
      fetch(e)
        .then(function(e) {
          return t(e.json());
        })
        .catch(function(e) {
          return o(e);
        });
    });
  }
  function Y(e, t, o) {
    var n = L.marker([t.latlng.lat, t.latlng.lng], {
      alt: 'marker',
      icon: new L.icon({ iconUrl: l().url, iconSize: l().iconSize, iconAnchor: l().iconAnchor }),
    });
    if ((n.addTo(e), o)) {
      var r = o.call(ve, t, n),
        a = L.popup({ offset: [0, -50] }).setContent(r);
      n.bindPopup(a).openPopup(), ve.addMarker(n);
    } else ve.addMarker(n, !0);
  }
  function K(e, t) {
    return (
      m(e),
      function(o, n) {
        1 === o && (ve.markers[0] && ve.removeMarker(ve.markers[0]), Y(e, n, t));
      }
    );
  }
  function Q(e, t) {
    return (
      m(e),
      function(o, n) {
        1 === o && Y(e, n, t);
      }
    );
  }
  function X(e, t) {
    var o = void 0,
      n = void 0,
      r = void 0,
      a = void 0;
    switch (e) {
      case 'leaflet':
        ((n = document.getElementById(t.target)).style.position = 'relative'),
          (n.style.padding = '0px'),
          (n.style.margin = '0px'),
          (a = {}),
          t.attribution || (a.attributionControl = !1),
          ((r = L.DomUtil.create('div')).style.height = '100%'),
          n.appendChild(r),
          (a.maxBounds = p()),
          (o = L.map(r, a).setView([t.center.latitude, t.center.longitude], t.zoom)),
          t.attribution && o.attributionControl.setPrefix(!1),
          o.zoomControl.setPosition(ue.MAP.zoomposition);
        break;
      case 'googlemaps':
        o = new google.maps.Map(document.getElementById(t.target), {
          center: { lat: t.center.latitude, lng: t.center.longitude },
          zoom: t.zoom,
          zoomControl: !0,
          zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
          fullscreenControl: !1,
        });
        break;
      case 'openlayers':
        ((o = new ol.Map({
          view: new ol.View({ center: ol.proj.fromLonLat([t.center.longitude, t.center.latitude]), zoom: t.zoom }),
          target: r,
        }))
          .getTargetElement()
          .getElementsByClassName('ol-zoom')[0].style.cssText = 'left: 5px !important; bottom: 5px !important'),
          o
            .getTargetElement()
            .getElementsByClassName('ol-zoom')[0]
            .classList.remove('ol-zoom');
    }
    return o;
  }
  function J(e, t) {
    if ('marker' === e.title) return void e.setMap(t);
    var o = [e.name, 'roadmap'];
    if ('wms' === e.name)
      return void t.setOptions({
        mapTypeControl: !0,
        mapTypeControlOptions: { mapTypeIds: o, position: google.maps.ControlPosition.BOTTOM_LEFT },
      });
    t.setOptions({
      mapTypeControl: !0,
      mapTypeControlOptions: { mapTypeIds: o, position: google.maps.ControlPosition.BOTTOM_LEFT },
    }),
      t.mapTypes.set(e.name, e),
      t.setMapTypeId(e.name);
  }
  function $(e, t, o) {
    switch (e) {
      case 'leaflet':
        o.addLayer(t);
        break;
      case 'googlemaps':
        J(t, o);
        break;
      case 'openlayers':
        o.addLayer(t);
    }
  }
  function ee(e, t, o) {
    var n = void 0;
    switch (e) {
      case 'leaflet':
        n = Le.leaflet.bgLayer(o);
        break;
      case 'googlemaps':
        n = Le.googlemaps.bgLayer(t, o);
        break;
      case 'openlayers':
        n = Le.openlayers.bgLayer(o);
    }
    return n;
  }
  function te(e, t, o) {
    var n = void 0;
    switch (e) {
      case 'leaflet':
        n = Le.leaflet.overlayLayer(o);
        break;
      case 'googlemaps':
        n = Le.googlemaps.overlayLayer(t, o);
        break;
      case 'openlayers':
        n = Le.openlayers.overlayLayer(o);
    }
    return n;
  }
  function oe(e, t, o) {
    var n = void 0;
    switch (e) {
      case 'leaflet':
        n = Le.leaflet.markerLayer(o);
        break;
      case 'googlemaps':
        n = Le.googlemaps.markerLayer(o);
        break;
      case 'openlayers':
        n = Le.openlayers.markerLayer(o);
    }
    return n;
  }
  function ne(e, t) {
    var o = void 0;
    switch (e) {
      case 'leaflet':
        o = S(t);
        break;
      case 'googlemaps':
        o = V(t);
        break;
      case 'openlayers':
        o = R(t);
    }
    return o;
  }
  function re(e, t) {
    return Object.assign({}, e, t);
  }
  function ae(e, t, o) {
    var n = void 0;
    switch (e) {
      case 'leaflet':
        Le[e].geoLocatorControl(t).addTo(o);
        break;
      case 'googlemaps':
        (n = Le[e].geoLocatorControl(t, o)), o.controls[google.maps.ControlPosition.TOP_RIGHT].push(n);
        break;
      case 'openlayers':
        (n = Le[e].geoLocatorControl(t, o)), o.addControl(n);
    }
  }
  function ie(e, t) {
    Le[e].geocoderControl(t, Le);
  }
  var se = e(function(e) {
      e.exports = function(e) {
        return (
          e || (e = {}),
          (e._subs = []),
          (e._paused = !1),
          (e._pending = []),
          (e.on = function(t, o) {
            (e._subs[t] = e._subs[t] || []), e._subs[t].push(o);
          }),
          (e.off = function(t, o) {
            if (e._subs[t])
              for (var n in e._subs[t])
                if (e._subs[t][n] === o) {
                  e._subs[t].splice(n);
                  break;
                }
          }),
          (e.emit = function(t) {
            if (e._subs[t]) {
              var o = Array.prototype.slice.call(arguments, 1);
              if (e._paused) return (e._pending[t] = e._pending[t] || []), void e._pending[t].push(o);
              for (var n in e._subs[t]) e._subs[t][n].apply(e, o);
            }
          }),
          (e.pause = function() {
            e._paused = !0;
          }),
          (e.resume = function() {
            e._paused = !1;
            for (var t in e._pending) for (var o = 0; o < e._pending[t].length; o++) e.emit(t, e._pending[t][o]);
          }),
          e
        );
      };
    }),
    le = {
      version: 0.2,
      basemaps: {
        defaults: {
          attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
          minZoom: 12,
          maxZoom: 21,
          type: 'tms',
          format: 'png',
          url: 'https://t1.data.amsterdam.nl',
        },
        layers: [
          { name: 'standaard', layerName: 'topo_wm' },
          { name: 'zwartwit', layerName: 'topo_wm_zw' },
          { name: 'licht', layerName: 'topo_wm_light' },
          { name: 'donker', layerName: 'topo_wm' },
        ],
      },
      wms: {
        defaults: {
          url: 'https://map.data.amsterdam.nl/maps',
          version: '1.1.0',
          transparent: !0,
          format: 'image/png',
          minZoom: 0,
          maxZoom: 24,
          styleName: '',
        },
        layers: [{ name: 'tram', layerName: 'trm', url: 'https://map.data.amsterdam.nl/maps/trm?' }],
      },
      geocoder: {
        suggestUrl: 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:amsterdam&',
        lookupUrl: 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?fq=gemeentenaam:amsterdam&',
      },
      featureQuery: { baseUrl: 'https://api.data.amsterdam.nl/bag/nummeraanduiding/?format=json&locatie=' },
      marker: {
        url: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 39],
      },
      map: {
        style: 'standaard',
        center: { latitude: 52.37, longitude: 4.8952 },
        zoom: 14,
        attribution: !0,
        extent: [52.25168, 4.64034, 52.50536, 5.10737],
        zoomposition: 'bottomright',
      },
      classnames: {
        geocoderContainer: ['embed-search'],
        geocoderSearch: ['invoer'],
        geocoderButton: ['primary', 'action', 'embed-search__button'],
        geocoderResultList: ['embed-search__auto-suggest'],
        geocoderResultItem: ['embed-search__auto-suggest__item'],
        geocoderResultSelected: ['embed-search__auto-suggest__item--active'],
      },
    },
    ue = {};
  (ue.BASE_DEFAULTS = { crs: 'EPSG:3857', attr: '', minZoom: 0, maxZoom: 19, type: 'wmts', format: 'png', url: '' }),
    (ue.WMS_DEFAULTS = {
      url: '',
      version: '1.1.1',
      transparent: !0,
      format: 'image/png',
      minZoom: 0,
      maxZoom: 24,
      styleName: '',
    }),
    (ue.BASEMAP_PROVIDERS = {}),
    (ue.WMS_PROVIDERS = {}),
    (ue.GEOCODER = {}),
    (ue.MAP = { zoomposition: 'bottomleft' }),
    (ue.MARKER = {}),
    (ue.CLASSNAMES = {
      geocoderContainer: ['nlmaps-geocoder-control-container'],
      geocoderSearch: ['nlmaps-geocoder-control-search'],
      geocoderButton: ['nlmaps-geocoder-control-button'],
      geocoderResultList: ['nlmaps-geocoder-result-list'],
      geocoderResultItem: ['nlmaps-geocoder-result-item'],
    }),
    0.2 !== le.version && t('unsupported config version'),
    void 0 !== le.featureQuery &&
      (function(e) {
        ue.FEATUREQUERYBASEURL = e;
      })(le.featureQuery.baseUrl),
    void 0 !== le.map &&
      (function(e) {
        ue.MAP = o(ue.MAP, e);
      })(le.map),
    (function(e) {
      var r = o(ue.BASE_DEFAULTS, e.defaults);
      (!e.layers || e.layers.length < 0) && t('no basemap defined, please define a basemap in the configuration'),
        e.layers.forEach(function(e) {
          (e.name && void 0 === ue.BASEMAP_PROVIDERS[e.name]) ||
            t('basemap names need to be defined and unique: ' + e.name),
            (ue.BASEMAP_PROVIDERS[e.name] = n(o(r, e)));
        });
    })(le.basemaps),
    void 0 !== le.wms &&
      (function(e) {
        var n = o(ue.WMS_DEFAULTS, e.defaults);
        e.layers &&
          e.layers.forEach(function(e) {
            (e.name && void 0 === ue.WMS_PROVIDERS[e.name]) || t('wms names need to be defined and unique: ' + e.name),
              (ue.WMS_PROVIDERS[e.name] = r(o(n, e)));
          });
      })(le.wms),
    void 0 !== le.geocoder &&
      (function(e) {
        (ue.GEOCODER.lookupUrl = e.lookupUrl), (ue.GEOCODER.suggestUrl = e.suggestUrl);
      })(le.geocoder),
    void 0 !== le.marker &&
      (function(e) {
        ue.MARKER = e;
      })(le.marker),
    void 0 !== le.classnames &&
      (function(e) {
        ue.CLASSNAMES = o(ue.CLASSNAMES, e);
      })(le.classnames);
  var ce = ue.GEOCODER;
  (ce.resultList = []),
    (ce.selectedResult = -1),
    (ce.doSuggestRequest = function(e) {
      return a(this.suggestUrl + 'q=' + encodeURIComponent(e));
    }),
    (ce.doLookupRequest = function(e) {
      return a(this.lookupUrl + 'id=' + encodeURIComponent(e)).then(function(e) {
        var t = e.response.docs[0];
        return (t.centroide_ll = i(t.centroide_ll)), (t.centroide_rd = i(t.centroide_rd)), t;
      });
    }),
    (ce.createControl = function(e, t, o) {
      var n = this;
      (this.zoomTo = e), (this.map = t), (this.nlmaps = o);
      var r = document.createElement('div'),
        a = document.createElement('form'),
        i = document.createElement('input'),
        l = document.createElement('button'),
        u = document.createElement('div');
      return (
        s(r, ue.CLASSNAMES.geocoderContainer),
        s(a, ue.CLASSNAMES.geocoderSearch),
        r.addEventListener('click', function(e) {
          return e.stopPropagation();
        }),
        r.addEventListener('dblclick', function(e) {
          return e.stopPropagation();
        }),
        (i.id = 'nlmaps-geocoder-control-input'),
        (i.placeholder = 'Zoomen naar adres...'),
        i.setAttribute('aria-label', 'Zoomen naar adres'),
        i.setAttribute('type', 'text'),
        i.setAttribute('autocapitalize', 'off'),
        i.setAttribute('autocomplete', 'off'),
        i.setAttribute('autocorrect', 'off'),
        i.setAttribute('spellcheck', 'false'),
        i.addEventListener('keydown', function(e) {
          var t = n.resultList;
          n.resultList.length > 0 &&
            (('ArrowDown' !== e.code && 40 !== e.keyCode) ||
              (n.selectedResult < n.resultList.length - 1 && n.selectedResult++,
              n.showLookupResult(t[n.selectedResult])),
            ('ArrowUp' !== e.code && 38 !== e.keyCode) ||
              (n.selectedResult > 0 && n.selectedResult--, n.showLookupResult(t[n.selectedResult])),
            'Escape' === e.code && n.clearSuggestResults(!0));
        }),
        i.addEventListener('input', function(e) {
          n.suggest(e.target.value);
        }),
        i.addEventListener('focus', function(e) {
          n.suggest(e.target.value);
        }),
        l.setAttribute('type', 'submit'),
        a.addEventListener('submit', function(e) {
          e.preventDefault(),
            n.resultList.length > 0 && n.lookup(n.resultList[n.selectedResult < 0 ? 0 : n.selectedResult].id);
        }),
        l.setAttribute('aria-label', 'Zoomen naar adres'),
        s(l, ue.CLASSNAMES.geocoderButton),
        (u.id = 'nlmaps-geocoder-control-results'),
        s(u, ue.CLASSNAMES.geocoderResultList),
        u.classList.add('nlmaps-hidden'),
        r.appendChild(a),
        a.appendChild(i),
        a.appendChild(l),
        r.appendChild(u),
        r
      );
    }),
    (ce.suggest = function(e) {
      var t = this;
      if (e.length < 3) return void this.clearSuggestResults();
      this.doSuggestRequest(e).then(function(e) {
        (t.resultList = e.response.docs), t.showSuggestResults(t.resultList);
      });
    }),
    (ce.lookup = function(e) {
      var t = this;
      this.doLookupRequest(e).then(function(e) {
        t.zoomTo(e.centroide_ll, t.map),
          t.nlmaps.emit('search-select', { location: e.weergavenaam, latlng: e.centroide_ll }),
          t.showLookupResult(e),
          t.clearSuggestResults();
      });
    }),
    (ce.clearSuggestResults = function(e) {
      (this.selectedResult = -1),
        e && (document.getElementById('nlmaps-geocoder-control-input').value = ''),
        (document.getElementById('nlmaps-geocoder-control-results').innerHTML = ''),
        document.getElementById('nlmaps-geocoder-control-results').classList.add('nlmaps-hidden');
    }),
    (ce.showLookupResult = function(e) {
      var t = document.getElementsByClassName(ue.CLASSNAMES.geocoderResultItem);
      Array.prototype.map.call(t, function(e) {
        return e.classList.remove(ue.CLASSNAMES.geocoderResultSelected);
      });
      var o = document.getElementById(e.id);
      o && o.classList.add(ue.CLASSNAMES.geocoderResultSelected),
        (document.getElementById('nlmaps-geocoder-control-input').value = e.weergavenaam);
    }),
    (ce.showSuggestResults = function(e) {
      var t = this;
      if ((this.clearSuggestResults(), e.length > 0)) {
        var o = document.createElement('ul');
        e.forEach(function(e) {
          var n = document.createElement('li'),
            r = document.createElement('a');
          (r.innerHTML = e.weergavenaam),
            (r.id = e.id),
            s(r, ue.CLASSNAMES.geocoderResultItem),
            r.setAttribute('href', '#'),
            r.addEventListener('click', function(e) {
              e.preventDefault(), t.lookup(e.target.id);
            }),
            n.appendChild(r),
            o.appendChild(n);
        }),
          document.getElementById('nlmaps-geocoder-control-results').classList.remove('nlmaps-hidden'),
          document.getElementById('nlmaps-geocoder-control-results').appendChild(o);
      }
    });
  var de =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function(e) {
          return typeof e;
        }
      : function(e) {
          return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
            ? 'symbol'
            : typeof e;
        };
  'undefined' != typeof L &&
    'object' === ('undefined' == typeof L ? 'undefined' : de(L)) &&
    ((L.NlmapsBgLayer = L.TileLayer.extend({
      initialize: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'standaard',
          t = arguments[1],
          o = c(e),
          n = L.Util.extend({}, t, {
            minZoom: o.minZoom,
            maxZoom: o.maxZoom,
            scheme: 'xyz',
            attribution: o.attribution,
            subdomains: o.subdomains ? o.subdomains : 'abc',
            sa_id: e,
          });
        L.TileLayer.prototype.initialize.call(this, o.url, n);
      },
    })),
    (L.nlmapsBgLayer = function(e, t) {
      return new L.NlmapsBgLayer(e, t);
    }),
    (L.NlmapsOverlayLayer = L.TileLayer.WMS.extend({
      initialize: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
          t = arguments[1],
          o = d(e, t),
          n = o.url;
        delete o.url;
        var r = L.Util.extend({}, t, {
          layers: o.layerName,
          maxZoom: 24,
          minZoom: 1,
          styles: o.styleName,
          version: o.version,
          transparent: o.transparent,
          format: o.format,
        });
        L.TileLayer.WMS.prototype.initialize.call(this, n, r);
      },
    })),
    (L.nlmapsOverlayLayer = function(e, t) {
      return new L.NlmapsOverlayLayer(e, t);
    }),
    (L.Control.GeoLocatorControl = L.Control.extend({
      options: { position: 'topright' },
      initialize: function(e) {
        for (var t in e) 'object' === de(this.options[t]) ? L.extend(this.options[t], e[t]) : (this.options[t] = e[t]);
      },
      onAdd: function(e) {
        function t(t) {
          e.panTo([t.coords.latitude, t.coords.longitude]);
        }
        var o = L.DomUtil.create('div');
        (o.id = 'nlmaps-geolocator-control'), (o.className = 'nlmaps-geolocator-control');
        var n = document.createElement('img');
        return (
          o.append(n),
          this.options.geolocator.isStarted() && L.DomUtil.addClass(o, 'started'),
          L.DomEvent.on(
            o,
            'click',
            function() {
              this.options.geolocator.start(), L.DomUtil.addClass(o, 'started');
            },
            this,
          ),
          this.options.geolocator.on('position', function(e) {
            L.DomUtil.removeClass(o, 'started'), L.DomUtil.addClass(o, 'has-position'), t(e);
          }),
          o
        );
      },
      onRemove: function(e) {
        return e;
      },
    })),
    (L.geoLocatorControl = function(e) {
      return new L.Control.GeoLocatorControl({ geolocator: e });
    }));
  var me = e(function(e) {
      e.exports = function(e) {
        return (
          e || (e = {}),
          (e._subs = []),
          (e._paused = !1),
          (e._pending = []),
          (e.on = function(t, o) {
            (e._subs[t] = e._subs[t] || []), e._subs[t].push(o);
          }),
          (e.off = function(t, o) {
            if (e._subs[t])
              for (var n in e._subs[t])
                if (e._subs[t][n] === o) {
                  e._subs[t].splice(n);
                  break;
                }
          }),
          (e.emit = function(t) {
            if (e._subs[t]) {
              var o = Array.prototype.slice.call(arguments, 1);
              if (e._paused) return (e._pending[t] = e._pending[t] || []), void e._pending[t].push(o);
              for (var n in e._subs[t]) e._subs[t][n].apply(e, o);
            }
          }),
          (e.pause = function() {
            e._paused = !0;
          }),
          (e.resume = function() {
            e._paused = !1;
            for (var t in e._pending) for (var o = 0; o < e._pending[t].length; o++) e.emit(t, e._pending[t][o]);
          }),
          e
        );
      };
    }),
    pe = { follow: !1 },
    fe = function(e) {
      var t = Object.assign({}, pe, e);
      return {
        start: function() {
          return (
            (t.started = !0),
            navigator.geolocation.getCurrentPosition(W.bind(this), G.bind(this), { maximumAge: 6e4 }),
            this
          );
        },
        stop: function() {
          return (t.started = !1), this;
        },
        isStarted: function() {
          return t.started;
        },
        log: function() {
          return console.log(t), this;
        },
      };
    },
    ge = function(e, t, o) {
      return function(n) {
        return function(r, a) {
          0 === r &&
            n(0, function(n, r) {
              1 === n
                ? H(t(e, { x: r.latlng.lng, y: r.latlng.lat })).then(function(e) {
                    var t = { queryResult: o(e), latlng: r.latlng };
                    a(1, t);
                  })
                : a(n, r);
            });
        };
      };
    },
    ye = function(e, t, o, n) {
      var r = ge(t, o, n)(e);
      return (
        (r.subscribe = function(e) {
          r(0, e);
        }),
        r
      );
    },
    ve = {
      markers: [],
      removeMarker: function(e) {
        var t = ve.markers.findIndex(function(t) {
          return t === e;
        });
        ve.markers[t].remove(), ve.markers.splice(t, 1);
      },
      addMarker: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        ve.markers.push(e),
          t &&
            e.on('click', function() {
              ve.removeMarker(e);
            });
      },
    },
    Le = {
      leaflet: { bgLayer: g, overlayLayer: y, markerLayer: f, geocoderControl: h, geoLocatorControl: v },
      openlayers: { bgLayer: w, overlayLayer: C, markerLayer: E, geocoderControl: A, geoLocatorControl: k },
      googlemaps: { bgLayer: B, overlayLayer: D, markerLayer: Z, geoLocatorControl: T, geocoderControl: F },
    };
  se(Le);
  var be = {};
  return (
    (Le.lib = (function() {
      var e = [];
      return (
        'object' === ('undefined' == typeof L ? 'undefined' : de(L)) && e.push('leaflet'),
        'object' === ('undefined' == typeof google ? 'undefined' : de(google)) &&
          'object' === de(google.maps) &&
          e.push('googlemaps'),
        'object' === ('undefined' == typeof ol ? 'undefined' : de(ol)) && e.push('openlayers'),
        e.length > 1 ? 'too many libs' : 0 === e.length ? 'too few libs' : e[0]
      );
    })()),
    (Le.createMap = function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = re(ue.MAP, e);
      try {
        if ('too many libs' == Le.lib || 'too few libs' === Le.lib)
          throw {
            message:
              'one and only one map library can be defined. Please Refer to the documentation to see which map libraries are supported.',
          };
      } catch (e) {
        console.error(e.message);
      }
      var o = X(Le.lib, t),
        n = ee(Le.lib, o, t.style);
      if (($(Le.lib, n, o, t.style), t.search && ie(Le.lib, o), t.marker)) {
        var r = t.marker;
        'boolean' == typeof t.marker && (r = ne(Le.lib, o));
        var a = oe(Le.lib, o, r);
        ve.addMarker(a, !0), $(Le.lib, a, o);
      }
      if (t.overlay && 'false' !== t.overlay) {
        var i = te(Le.lib, o, t.overlay);
        $(Le.lib, i, o);
      }
      return (
        void 0 !== o &&
          o.on('click', function(e) {
            Le.emit('mapclick', e);
          }),
        o
      );
    }),
    (Le.geoLocate = function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        o = q(re(be, t));
      ae(Le.lib, o, e);
    }),
    (Le.clickProvider = function(e) {
      m(e);
      var t = function(t, o) {
        0 === t &&
          (e.on('click', function(e) {
            o(1, e);
          }),
          o(0, function(e, t) {}));
      };
      return (
        (t.subscribe = function(e) {
          t(0, e);
        }),
        t
      );
    }),
    (Le.queryFeatures = ye),
    (Le.singleMarker = K),
    (Le.multiMarker = Q),
    Le
  );
})();

export default amaps;
