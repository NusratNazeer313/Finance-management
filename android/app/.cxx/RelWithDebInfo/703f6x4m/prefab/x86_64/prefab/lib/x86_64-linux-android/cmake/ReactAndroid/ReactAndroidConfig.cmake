if(NOT TARGET ReactAndroid::hermestooling)
add_library(ReactAndroid::hermestooling SHARED IMPORTED)
set_target_properties(ReactAndroid::hermestooling PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/hermestooling/libs/android.x86_64/libhermestooling.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/hermestooling/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::jsi)
add_library(ReactAndroid::jsi SHARED IMPORTED)
set_target_properties(ReactAndroid::jsi PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/jsi/libs/android.x86_64/libjsi.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/jsi/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::reactnative)
add_library(ReactAndroid::reactnative SHARED IMPORTED)
set_target_properties(ReactAndroid::reactnative PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/reactnative/libs/android.x86_64/libreactnative.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/2454197a7a7bdd22c9814cde61f3ed7f/transformed/react-android-0.86.0-release/prefab/modules/reactnative/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

